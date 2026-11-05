import{r as h,j as e,dJ as ee,aT as B,aX as W,bF as Y,ag as ae,aw as X,L,dl as te,aE as se}from"./vendor-CcQLUIs6.js";import{v as I,aj as S,ak as T,al as R,w as D,a as j,B as _,r as p,ab as re,Q as ne,I as k,T as u,s as w}from"./index-Dm2WSxQF.js";import{L as l}from"./label-BNj9TYGp.js";import{S as ie}from"./switch-C1GxS7Bd.js";import{S as oe,a as le,b as de,c as ce,d as ge}from"./select-bKFxTlRT.js";import{A as G,b as P,a as O}from"./alert-C2lNITmY.js";import{S as pe}from"./SearchMarketingShell-D57EJzIU.js";import{A as ue,a as me,b as he,c as _e}from"./accordion-C66UUGtv.js";import{n as M,d as ve,c as xe,W as ye}from"./sm-deploy-C3Fa7lRG.js";import{t as be,u as je,w as fe,x as ke,y as Ae}from"./useGoogleAds-BC-gCc1N.js";import"./ui-DnlpRGgk.js";import"./AdminLayout-C0mf6WyE.js";import"./index-DPrj_ZlX.js";import"./separator-Bo-S9x5r.js";import"./skeleton-DShX6B2r.js";import"./scroll-area-CpNM93GG.js";import"./admin-translations-DesajleG.js";import"./nl-CqKc2wvz.js";import"./useAdminTranslation-CAJdFwXs.js";import"./audit-Bs0XqOix.js";import"./sm-campaign-DIhVMrhF.js";const $="1.0.0";function Ne(n){const m=n.endpoint.replace(/'/g,"\\'"),v=(n.expectedCustomerId||"").replace(/'/g,"\\'");return`/**
 * AI Search Marketing — Google Ads deployment worker
 * Version ${$}
 *
 * Creates approved campaigns from the CRM in THIS Google Ads account, always PAUSED.
 * Schedule: hourly.
 *
 * Paste your one-time worker token below. Never share this script afterwards.
 */
var CRM_ENDPOINT = '${m}';
var WORKER_TOKEN = 'PASTE_YOUR_WORKER_TOKEN_HERE';
var EXPECTED_CUSTOMER_ID = '${v}';
var SCRIPT_VERSION = '${$}';

/* ------------------------------------------------------------------ helpers */

function digits(value) {
  return String(value || '').replace(/[^0-9]/g, '');
}

function log(message) {
  Logger.log('[sm-worker ' + SCRIPT_VERSION + '] ' + message);
}

function crm(action, body) {
  var payload = body || {};
  payload.action = action;
  payload.script_version = SCRIPT_VERSION;
  payload.worker_version = SCRIPT_VERSION;
  payload.actual_customer_id = digits(AdsApp.currentAccount().getCustomerId());

  var response = UrlFetchApp.fetch(CRM_ENDPOINT, {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-ads-token': WORKER_TOKEN },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  var code = response.getResponseCode();
  var text = response.getContentText();
  if (code === 401) throw new Error('UNAUTHORIZED: CRM rejected the worker token.');
  if (code === 403) throw new Error('FORBIDDEN: CRM refused this worker.');
  if (code >= 500) throw new Error('CRM_5XX: CRM error ' + code);
  if (code >= 400) throw new Error('CRM_ERROR ' + code + ': ' + text);

  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error('INVALID_PAYLOAD: CRM returned malformed JSON.');
  }
}

/** Canonical JSON — must match the CRM implementation exactly. */
function canonical(value) {
  if (value === null || value === undefined || typeof value !== 'object') {
    return JSON.stringify(value === undefined ? null : value);
  }
  if (Object.prototype.toString.call(value) === '[object Array]') {
    var parts = [];
    for (var i = 0; i < value.length; i++) parts.push(canonical(value[i]));
    return '[' + parts.join(',') + ']';
  }
  var keys = Object.keys(value).sort();
  var out = [];
  for (var k = 0; k < keys.length; k++) {
    out.push(JSON.stringify(keys[k]) + ':' + canonical(value[keys[k]]));
  }
  return '{' + out.join(',') + '}';
}

function sha256Hex(text) {
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text, Utilities.Charset.UTF_8);
  var hex = '';
  for (var i = 0; i < bytes.length; i++) {
    var b = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
    hex += (b < 16 ? '0' : '') + b.toString(16);
  }
  return hex;
}

function verifyPayloadHash(payload) {
  var expected = payload.payload_hash;
  var copy = {};
  for (var key in payload) {
    if (key !== 'payload_hash') copy[key] = payload[key];
  }
  var actual = sha256Hex(canonical(copy));
  return actual === expected;
}

function isValidUrl(url) {
  return typeof url === 'string' && /^https?:\\/\\/[^\\s]+$/i.test(url);
}

function matchTypeToCriterion(matchType, negativeLevel) {
  var base = matchType === 'EXACT' ? 'Exact' : matchType === 'PHRASE' ? 'Phrase' : 'Broad';
  if (negativeLevel === 'CAMPAIGN') return 'Campaign Negative ' + base;
  if (negativeLevel === 'AD_GROUP') return 'Negative ' + base;
  return base;
}

function findCampaign(name) {
  var it = AdsApp.campaigns().withCondition('CampaignName = "' + name.replace(/"/g, '') + '"').get();
  return it.hasNext() ? it.next() : null;
}

function findAdGroup(campaignName, adGroupName) {
  var it = AdsApp.adGroups()
    .withCondition('CampaignName = "' + campaignName.replace(/"/g, '') + '"')
    .withCondition('AdGroupName = "' + adGroupName.replace(/"/g, '') + '"')
    .get();
  return it.hasNext() ? it.next() : null;
}

/* --------------------------------------------------------------------- main */

function main() {
  log('worker started');

  var actual = digits(AdsApp.currentAccount().getCustomerId());
  if (digits(EXPECTED_CUSTOMER_ID) !== actual) {
    log('CUSTOMER_ID_MISMATCH — expected ' + EXPECTED_CUSTOMER_ID + ', running in ' + actual + '. No changes made.');
    try {
      crm('ping', { customer_id_mismatch: true });
    } catch (e) {
      log('heartbeat failed: ' + e.message);
    }
    return;
  }

  crm('ping', {});
  log('CRM connected, customer ID validated');

  var claim = crm('claim', {});
  if (!claim.job) {
    log('no deployment jobs waiting');
    return;
  }

  var jobId = claim.job.id;
  var claimToken = claim.job.claim_token;
  log('deployment claimed: ' + jobId + ' (' + claim.job.mode + ')');

  try {
    runDeployment(jobId, claimToken);
  } catch (e) {
    log('deployment failed: ' + e.message);
    try {
      crm('fail', {
        job_id: jobId,
        claim_token: claimToken,
        error_code: String(e.message).split(':')[0],
        errors: [{ message: String(e.message) }]
      });
    } catch (inner) {
      log('could not report failure: ' + inner.message);
    }
  }
}

function runDeployment(jobId, claimToken) {
  var data = crm('payload', { job_id: jobId, claim_token: claimToken });
  var payload = data.payload;
  var existing = data.existing_entities || {};
  var results = [];

  crm('progress', { job_id: jobId, claim_token: claimToken, stage: 'VALIDATING' });

  if (!payload || payload.deployment_schema_version !== 1) throw new Error('INVALID_PAYLOAD: unknown schema');
  if (payload.campaign.status !== 'PAUSED') throw new Error('INVALID_PAYLOAD: payload is not PAUSED');
  if (!verifyPayloadHash(payload)) throw new Error('PAYLOAD_HASH_MISMATCH: payload integrity check failed');
  if (digits(payload.google_customer_id) !== digits(AdsApp.currentAccount().getCustomerId())) {
    throw new Error('CUSTOMER_ID_MISMATCH: payload targets another account');
  }
  for (var r = 0; r < payload.responsive_search_ads.length; r++) {
    if (!isValidUrl(payload.responsive_search_ads[r].final_url)) throw new Error('INVALID_URL: ad final URL invalid');
  }
  log('payload validated');

  if (payload.mode === 'PREVIEW') {
    crm('complete', {
      job_id: jobId,
      claim_token: claimToken,
      preview: true,
      entity_results: [],
      result: { preview: true, message: 'Payload validated in the live account. No entities were created.' }
    });
    log('preview completed — no Google Ads entities created');
    return;
  }

  var campaignName = payload.campaign.name;

  /* --------------------------------------------------------- campaign stage */
  crm('progress', { job_id: jobId, claim_token: claimToken, stage: 'CREATING_CAMPAIGN' });

  var campaign = findCampaign(campaignName);
  if (campaign) {
    log('campaign already exists — reusing (idempotent retry)');
    results.push({ entity_type: 'CAMPAIGN', crm_entity_id: payload.campaign_id, label: campaignName, google_entity_id: String(campaign.getId()), result: 'REUSED' });
  } else {
    var campaignUpload = AdsApp.bulkUploads().newCsvUpload(
      ['Campaign', 'Campaign Type', 'Budget', 'Bid Strategy Type', 'Campaign Status', 'Networks', 'Languages'],
      { moneyInMicros: false }
    );
    campaignUpload.append({
      'Campaign': campaignName,
      'Campaign Type': 'Search',
      'Budget': String(payload.campaign.daily_budget),
      'Bid Strategy Type': payload.campaign.bidding_strategy === 'MANUAL_CPC' ? 'Manual CPC' : 'Maximize clicks',
      'Campaign Status': 'Paused',
      'Networks': 'Google search',
      'Languages': (payload.campaign.languages || []).join(';')
    });
    campaignUpload.apply();

    campaign = findCampaign(campaignName);
    if (!campaign) throw new Error('GOOGLE_TEMPORARY_FAILURE: campaign was not created');
    campaign.pause();
    results.push({ entity_type: 'CAMPAIGN', crm_entity_id: payload.campaign_id, label: campaignName, google_entity_id: String(campaign.getId()), result: 'CREATED' });
    log('campaign created PAUSED: ' + campaign.getId());
  }

  // Hard safety: never leave the campaign enabled.
  if (campaign.isEnabled()) campaign.pause();

  // Attribution: CRM-managed campaigns carry the campaign context in their final URLs so every
  // click can be traced back to campaign, ad group, keyword, ad, match type, device and network.
  // Only campaigns created by this CRM are touched; existing campaigns are never modified here.
  try {
    var suffix = payload.campaign.final_url_suffix || '';
    if (suffix && campaign.urls && campaign.urls().getFinalUrlSuffix() !== suffix) {
      campaign.urls().setFinalUrlSuffix(suffix);
      log('attribution suffix applied to CRM campaign');
    }
  } catch (suffixError) {
    log('attribution suffix could not be applied: ' + suffixError);
  }

  crm('progress', {
    job_id: jobId, claim_token: claimToken, stage: 'CREATING_CAMPAIGN',
    google_campaign_id: String(campaign.getId()),
    entity_results: results
  });

  /* -------------------------------------------------------- targeting stage */
  crm('progress', { job_id: jobId, claim_token: claimToken, stage: 'APPLYING_TARGETING' });

  applyLocations(campaign, payload, results);

  /* -------------------------------------------------------- negatives stage */
  crm('progress', { job_id: jobId, claim_token: claimToken, stage: 'CREATING_NEGATIVES' });

  for (var n = 0; n < payload.negative_keywords.length; n++) {
    var neg = payload.negative_keywords[n];
    if (neg.level !== 'CAMPAIGN') continue;
    try {
      campaign.createNegativeKeyword(formatKeyword(neg.text, neg.match_type));
      results.push({ entity_type: 'NEGATIVE_KEYWORD', crm_entity_id: neg.crm_id, label: neg.text, result: 'CREATED' });
    } catch (e) {
      results.push({ entity_type: 'NEGATIVE_KEYWORD', crm_entity_id: neg.crm_id, label: neg.text, result: 'FAILED', error_message: String(e.message) });
    }
  }

  /* -------------------------------------------------------- ad group stage */
  crm('progress', { job_id: jobId, claim_token: claimToken, stage: 'CREATING_AD_GROUPS' });

  var adGroupUpload = AdsApp.bulkUploads().newCsvUpload(
    ['Campaign', 'Ad Group', 'Max CPC', 'Ad Group Status'], { moneyInMicros: false }
  );
  var pendingGroups = [];
  for (var g = 0; g < payload.ad_groups.length; g++) {
    var ag = payload.ad_groups[g];
    if (findAdGroup(campaignName, ag.name)) {
      results.push({ entity_type: 'AD_GROUP', crm_entity_id: ag.crm_id, label: ag.name, google_entity_id: String(findAdGroup(campaignName, ag.name).getId()), result: 'REUSED' });
      continue;
    }
    adGroupUpload.append({
      'Campaign': campaignName,
      'Ad Group': ag.name,
      'Max CPC': ag.cpc_bid ? String(ag.cpc_bid) : '',
      'Ad Group Status': 'Paused'
    });
    pendingGroups.push(ag);
  }
  if (pendingGroups.length) adGroupUpload.apply();

  for (var gp = 0; gp < pendingGroups.length; gp++) {
    var created = findAdGroup(campaignName, pendingGroups[gp].name);
    results.push({
      entity_type: 'AD_GROUP',
      crm_entity_id: pendingGroups[gp].crm_id,
      label: pendingGroups[gp].name,
      google_entity_id: created ? String(created.getId()) : null,
      result: created ? 'CREATED' : 'FAILED',
      error_message: created ? null : 'Ad group was not created by the bulk upload.'
    });
  }

  var groupNameById = {};
  for (var gn = 0; gn < payload.ad_groups.length; gn++) groupNameById[payload.ad_groups[gn].crm_id] = payload.ad_groups[gn].name;

  /* --------------------------------------------------------- keyword stage */
  crm('progress', { job_id: jobId, claim_token: claimToken, stage: 'CREATING_KEYWORDS' });

  var kwUpload = AdsApp.bulkUploads().newCsvUpload(['Campaign', 'Ad Group', 'Keyword', 'Criterion Type'], { moneyInMicros: false });
  var pendingKeywords = [];
  for (var k = 0; k < payload.keywords.length; k++) {
    var kw = payload.keywords[k];
    var gname = groupNameById[kw.ad_group_crm_id];
    if (!gname || !findAdGroup(campaignName, gname)) {
      results.push({ entity_type: 'KEYWORD', crm_entity_id: kw.crm_id, label: kw.text, result: 'FAILED', error_message: 'Parent ad group missing.' });
      continue;
    }
    kwUpload.append({ 'Campaign': campaignName, 'Ad Group': gname, 'Keyword': kw.text, 'Criterion Type': matchTypeToCriterion(kw.match_type, null) });
    pendingKeywords.push(kw);
  }
  if (pendingKeywords.length) kwUpload.apply();
  for (var pk = 0; pk < pendingKeywords.length; pk++) {
    results.push({ entity_type: 'KEYWORD', crm_entity_id: pendingKeywords[pk].crm_id, label: pendingKeywords[pk].text, result: 'CREATED' });
  }

  /* --------------------------------------------- ad group negatives + ads */
  for (var an = 0; an < payload.negative_keywords.length; an++) {
    var agn = payload.negative_keywords[an];
    if (agn.level !== 'AD_GROUP') continue;
    var target = findAdGroup(campaignName, groupNameById[agn.ad_group_crm_id] || '');
    if (!target) {
      results.push({ entity_type: 'NEGATIVE_KEYWORD', crm_entity_id: agn.crm_id, label: agn.text, result: 'FAILED', error_message: 'Parent ad group missing.' });
      continue;
    }
    try {
      target.createNegativeKeyword(formatKeyword(agn.text, agn.match_type));
      results.push({ entity_type: 'NEGATIVE_KEYWORD', crm_entity_id: agn.crm_id, label: agn.text, result: 'CREATED' });
    } catch (e2) {
      results.push({ entity_type: 'NEGATIVE_KEYWORD', crm_entity_id: agn.crm_id, label: agn.text, result: 'FAILED', error_message: String(e2.message) });
    }
  }

  crm('progress', { job_id: jobId, claim_token: claimToken, stage: 'CREATING_ADS' });
  createAds(campaignName, payload, groupNameById, results);

  /* ------------------------------------------------------------ asset stage */
  crm('progress', { job_id: jobId, claim_token: claimToken, stage: 'CREATING_ASSETS' });
  for (var a = 0; a < payload.assets.length; a++) {
    results.push({
      entity_type: 'ASSET',
      crm_entity_id: payload.assets[a].crm_id,
      label: payload.assets[a].asset_type,
      result: 'UNSUPPORTED',
      error_message: 'Asset type ' + payload.assets[a].asset_type + ' is not supported by worker ' + SCRIPT_VERSION + '. Add it manually in Google Ads.'
    });
  }

  /* ------------------------------------------------------------- finalising */
  crm('progress', { job_id: jobId, claim_token: claimToken, stage: 'FINALISING' });
  if (campaign.isEnabled()) campaign.pause();

  var failed = 0;
  for (var f = 0; f < results.length; f++) if (results[f].result === 'FAILED') failed++;

  crm('complete', {
    job_id: jobId,
    claim_token: claimToken,
    google_campaign_id: String(campaign.getId()),
    partial: failed > 0,
    entity_results: results,
    result: { failed: failed, total: results.length }
  });
  log('deployment finished — ' + failed + ' failed of ' + results.length + ' operations, campaign left PAUSED');
}

function formatKeyword(text, matchType) {
  if (matchType === 'EXACT') return '[' + text + ']';
  if (matchType === 'PHRASE') return '"' + text + '"';
  return text;
}

function applyLocations(campaign, payload, results) {
  var targets = payload.campaign.target_locations || [];
  for (var i = 0; i < targets.length; i++) {
    var value = String(targets[i]);
    if (/^[0-9]+$/.test(value)) {
      try {
        campaign.addLocation(parseInt(value, 10));
        results.push({ entity_type: 'CAMPAIGN', crm_entity_id: 'location:' + value, label: 'Location ' + value, result: 'CREATED' });
      } catch (e) {
        results.push({ entity_type: 'CAMPAIGN', crm_entity_id: 'location:' + value, label: 'Location ' + value, result: 'FAILED', error_message: String(e.message) });
      }
    } else {
      results.push({
        entity_type: 'CAMPAIGN', crm_entity_id: 'location:' + value, label: 'Location ' + value, result: 'SKIPPED',
        error_message: 'Location "' + value + '" is not a Google geo criterion ID and cannot be resolved safely by the worker. Set it manually in Google Ads.'
      });
    }
  }
  var excluded = payload.campaign.excluded_locations || [];
  for (var x = 0; x < excluded.length; x++) {
    var ev = String(excluded[x]);
    if (/^[0-9]+$/.test(ev)) {
      try {
        campaign.excludeLocation(parseInt(ev, 10));
        results.push({ entity_type: 'CAMPAIGN', crm_entity_id: 'excluded:' + ev, label: 'Excluded ' + ev, result: 'CREATED' });
      } catch (e) {
        results.push({ entity_type: 'CAMPAIGN', crm_entity_id: 'excluded:' + ev, label: 'Excluded ' + ev, result: 'FAILED', error_message: String(e.message) });
      }
    } else {
      results.push({
        entity_type: 'CAMPAIGN', crm_entity_id: 'excluded:' + ev, label: 'Excluded ' + ev, result: 'SKIPPED',
        error_message: 'Excluded location "' + ev + '" is not a Google geo criterion ID.'
      });
    }
  }
}

function createAds(campaignName, payload, groupNameById, results) {
  var columns = ['Campaign', 'Ad Group', 'Ad type', 'Final URL', 'Path 1', 'Path 2', 'Status'];
  for (var h = 1; h <= 15; h++) columns.push('Headline ' + h);
  for (var d = 1; d <= 4; d++) columns.push('Description ' + d);

  var upload = AdsApp.bulkUploads().newCsvUpload(columns, { moneyInMicros: false });
  var pending = [];

  for (var i = 0; i < payload.responsive_search_ads.length; i++) {
    var ad = payload.responsive_search_ads[i];
    var gname = groupNameById[ad.ad_group_crm_id];
    if (!gname || !findAdGroup(campaignName, gname)) {
      results.push({ entity_type: 'RSA', crm_entity_id: ad.crm_id, label: 'RSA', result: 'FAILED', error_message: 'Parent ad group missing.' });
      continue;
    }
    var row = {
      'Campaign': campaignName,
      'Ad Group': gname,
      'Ad type': 'Responsive search ad',
      'Final URL': ad.final_url,
      'Path 1': ad.path1 || '',
      'Path 2': ad.path2 || '',
      'Status': 'Paused'
    };
    for (var hh = 0; hh < 15; hh++) row['Headline ' + (hh + 1)] = ad.headlines[hh] ? ad.headlines[hh].text : '';
    for (var dd = 0; dd < 4; dd++) row['Description ' + (dd + 1)] = ad.descriptions[dd] ? ad.descriptions[dd].text : '';
    upload.append(row);
    pending.push(ad);
  }

  if (!pending.length) return;
  upload.apply();
  for (var p = 0; p < pending.length; p++) {
    results.push({ entity_type: 'RSA', crm_entity_id: pending[p].crm_id, label: 'RSA', result: 'CREATED' });
  }
}
`}const we={NOT_CONFIGURED:"Niet geconfigureerd",CONFIGURED_NOT_CONNECTED:"Geconfigureerd — script nog niet verbonden",CONNECTED:"Verbonden",ERROR:"Fout",DISABLED:"Uitrol uitgeschakeld"},Ee={NOT_CONFIGURED:"bg-muted text-muted-foreground",CONFIGURED_NOT_CONNECTED:"bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",CONNECTED:"bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",ERROR:"bg-destructive/10 text-destructive border-destructive/30",DISABLED:"bg-muted text-muted-foreground"};function K(n){return n?new Date(n).toLocaleString("nl-NL"):"nog nooit"}function Ce({settings:n,hasActiveToken:m}){const[v,A]=h.useState(null),x=be(!1),y="https://czxvxctbeyckligmmbgy.supabase.co/functions/v1/google-ads-script",c=h.useMemo(()=>Ne({endpoint:y,expectedCustomerId:M(n.google_customer_id)}),[y,n.google_customer_id]),b=ve({googleCustomerId:n.google_customer_id,hasActiveToken:m,deploymentEnabled:n.deployment_enabled,lastHeartbeatAt:n.last_script_heartbeat_at,actualCustomerId:n.actual_customer_id}),i=n.actual_customer_id?xe(n.google_customer_id,n.actual_customer_id):null,t=async()=>{var o;const g=await x.refetch();if(g.error||!((o=g.data)!=null&&o.account)){const f=g.error instanceof Error?g.error.message:"De live verbinding kon niet worden gecontroleerd.";A(`Verbinding mislukt: ${f}`),p.error("De live Google Ads-verbinding kon niet worden bevestigd.");return}const d=g.data.account,r=[];r.push(`Account: ${d.display_name}`),r.push(`Klant-ID: ${d.customer_id}`),r.push(`Valuta en tijdzone: ${d.currency} · ${d.time_zone}`),r.push(`Facturatie: ${d.billing_configured?"ingesteld":"niet bevestigd"}`),r.push(`Conversiedoel: ${d.conversion_goal_present?"aanwezig":"ontbreekt"}`),r.push(`Recent actief: ${d.serving?"ja":"nee"}`),r.push(`Automatische tagging: ${d.auto_tagging_enabled?"aan":"uit"}`),r.push(`Gecontroleerd: ${K(d.checked_at)}`),A(r.join(`
`)),p.success("Live Google Ads-verbinding bevestigd — er is niets gewijzigd.")};return e.jsxs(I,{children:[e.jsxs(S,{children:[e.jsxs(T,{className:"text-base flex items-center gap-2",children:[e.jsx(ee,{className:"h-4 w-4"})," Google Ads-verbinding"]}),e.jsx(R,{children:"Het Google Ads Script draait in het account zelf en haalt elk uur goedgekeurde uitrol-jobs op. Een ingevuld klant-ID betekent nog niet dat het script verbonden is."})]}),e.jsxs(D,{className:"space-y-3 text-sm",children:[e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(j,{variant:"outline",className:"border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",children:"Account verbonden"}),e.jsxs(j,{variant:"outline",className:Ee[b],children:["Uitrolscript: ",we[b]]}),e.jsx(j,{variant:"outline",children:"Rapportage: verbonden"})]}),e.jsxs("div",{className:"grid gap-1.5 sm:grid-cols-2",children:[e.jsxs("div",{children:["Verwacht klant-ID: ",e.jsx("span",{className:"font-medium",children:M(n.google_customer_id)||"—"})]}),e.jsxs("div",{children:["Gemeten klant-ID: ",e.jsx("span",{className:"font-medium",children:n.actual_customer_id??"—"})]}),e.jsxs("div",{children:["Laatste heartbeat: ",e.jsx("span",{className:"font-medium",children:K(n.last_script_heartbeat_at)})]}),e.jsxs("div",{children:["Laatste worker-run: ",e.jsx("span",{className:"font-medium",children:K(n.last_worker_run_at)})]}),e.jsxs("div",{children:["Scriptversie: ",e.jsx("span",{className:"font-medium",children:n.worker_script_version??"—"})]}),e.jsxs("div",{children:["Uitrol: ",e.jsx("span",{className:"font-medium",children:n.deployment_enabled?"toegestaan (gepauzeerd)":"uitgeschakeld"})]})]}),n.last_deployment_error&&e.jsxs(G,{variant:"destructive",children:[e.jsx(B,{className:"h-4 w-4"}),e.jsx(P,{children:"Laatste fout"}),e.jsx(O,{children:n.last_deployment_error})]}),i===!1&&e.jsxs(G,{variant:"destructive",children:[e.jsx(B,{className:"h-4 w-4"}),e.jsx(P,{children:"Klant-ID komt niet overeen"}),e.jsx(O,{children:"Het script draait in een ander Google Ads-account. Er worden geen wijzigingen doorgevoerd zolang dit verschilt."})]}),e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsxs(_,{size:"sm",variant:"outline",disabled:x.isFetching,onClick:t,children:[e.jsx(W,{className:`h-3.5 w-3.5 mr-1 ${x.isFetching?"animate-spin":""}`})," Live verbinding testen"]}),e.jsxs(_,{size:"sm",variant:"outline",onClick:()=>{navigator.clipboard.writeText(c),p.success("Script gekopieerd")},children:[e.jsx(Y,{className:"h-3.5 w-3.5 mr-1"})," Google Ads Script kopiëren"]}),e.jsxs(_,{size:"sm",variant:"outline",onClick:()=>{const g=new Blob([c],{type:"text/plain;charset=utf-8"}),d=URL.createObjectURL(g),r=document.createElement("a");r.href=d,r.download=`google-ads-worker-${ye}.js`,r.click(),URL.revokeObjectURL(d)},children:[e.jsx(ae,{className:"h-3.5 w-3.5 mr-1"})," Downloaden"]})]}),v&&e.jsxs(G,{children:[e.jsx(X,{className:"h-4 w-4"}),e.jsx(P,{children:"Resultaat verbindingstest"}),e.jsx(O,{children:e.jsx("pre",{className:"whitespace-pre-wrap text-xs",children:v})})]}),e.jsx(ue,{type:"single",collapsible:!0,children:e.jsxs(me,{value:"install",children:[e.jsx(he,{className:"text-sm",children:"Installatie-instructies (14 stappen)"}),e.jsxs(_e,{children:[e.jsxs("ol",{className:"list-decimal space-y-1 pl-5 text-sm",children:[e.jsx("li",{children:"Vul hierboven het Google Ads klant-ID in en sla op."}),e.jsx("li",{children:"Maak een script-token aan (hieronder) en kopieer het direct — je ziet het maar één keer."}),e.jsx("li",{children:"Klik op “Google Ads Script kopiëren”."}),e.jsxs("li",{children:["Plak het token in de regel ",e.jsx("code",{children:"var WORKER_TOKEN = 'PASTE_YOUR_WORKER_TOKEN_HERE';"}),"."]}),e.jsxs("li",{children:["Open Google Ads en controleer dat je in het juiste account zit (",M(n.google_customer_id)||"klant-ID nog niet ingevuld",")."]}),e.jsx("li",{children:"Ga naar Tools → Bulkacties → Scripts."}),e.jsx("li",{children:"Klik op + om een nieuw script te maken."}),e.jsx("li",{children:"Plak het gekopieerde script."}),e.jsx("li",{children:"Klik op “Autoriseren” en geef toestemming."}),e.jsx("li",{children:"Klik op “Voorbeeld” of “Uitvoeren” om de verbindingstest te draaien."}),e.jsx("li",{children:"Controleer in de logs dat het klant-ID gevalideerd is."}),e.jsx("li",{children:"Zet een planning op “Elk uur”."}),e.jsx("li",{children:"Kom terug in de CRM."}),e.jsx("li",{children:"Controleer hierboven dat de status “Verbonden” is en de heartbeat recent is."})]}),e.jsx("p",{className:"mt-2 text-xs text-muted-foreground",children:"Het script bevat nooit databasewachtwoorden of CRM-inloggegevens — alleen het endpoint, jouw token, het klant-ID en de scriptversie."})]})]})})]})]})}function E(n){return(n??[]).join(`
`)}function C(n){return n.split(`
`).map(m=>m.trim()).filter(Boolean)}function Je(){const n=re(),{data:m=[],isLoading:v,refetch:A}=je(),x=fe(),y=ke(),[c,b]=h.useState();h.useEffect(()=>{!c&&m.length&&b(m[0].id)},[m,c]);const i=m.find(a=>a.id===c),{data:t}=Ae(c),[g,d]=h.useState({display_name:"",google_customer_id:"",notes:""}),[r,o]=h.useState({website:"",business_description:"",products_services:"",target_audiences:"",conversion_goals:"",brand_tone:"",usps:"",prohibited_claims:"",prohibited_wording:"",preferred_ctas:"",landing_page_rules:"",legal_notes:"",ai_instructions:""}),[f,J]=h.useState(null),[N,V]=h.useState(""),[F,H]=h.useState(!1);h.useEffect(()=>{i&&d({display_name:i.display_name,google_customer_id:i.google_customer_id,notes:i.notes??""})},[i==null?void 0:i.id]),h.useEffect(()=>{o({website:(t==null?void 0:t.website)??"",business_description:(t==null?void 0:t.business_description)??"",products_services:(t==null?void 0:t.products_services)??"",target_audiences:(t==null?void 0:t.target_audiences)??"",conversion_goals:(t==null?void 0:t.conversion_goals)??"",brand_tone:(t==null?void 0:t.brand_tone)??"",usps:E(t==null?void 0:t.usps),prohibited_claims:E(t==null?void 0:t.prohibited_claims),prohibited_wording:E(t==null?void 0:t.prohibited_wording),preferred_ctas:E(t==null?void 0:t.preferred_ctas),landing_page_rules:(t==null?void 0:t.landing_page_rules)??"",legal_notes:(t==null?void 0:t.legal_notes)??"",ai_instructions:(t==null?void 0:t.ai_instructions)??""})},[t==null?void 0:t.id,c]);const{data:U=[],refetch:z}=ne({queryKey:["google-ads","tokens",c],enabled:!!c,queryFn:async()=>{const{data:a,error:s}=await w.functions.invoke("google-ads-token",{body:{action:"list",settings_id:c}});if(s)throw s;return a.tokens??[]}}),q=async()=>{if(!(!c||!N.trim())){H(!0);try{const{data:a,error:s}=await w.functions.invoke("google-ads-token",{body:{action:"create",settings_id:c,name:N.trim()}});if(s)throw s;J(a.token),V(""),z(),p.success("Token aangemaakt — kopieer hem nu, hij is later niet meer zichtbaar.")}catch(a){p.error(a.message)}finally{H(!1)}}},Q=async a=>{try{const{error:s}=await w.functions.invoke("google-ads-token",{body:{action:"revoke",token_id:a}});if(s)throw s;z(),p.success("Token ingetrokken")}catch(s){p.error(s.message)}},Z=async a=>{if(!i)return;const{error:s}=await w.from("google_ads_settings").update({deployment_enabled:a}).eq("id",i.id);if(s)return p.error(s.message);n.invalidateQueries({queryKey:["google-ads","settings"]}),p.success(a?"Uitrol ingeschakeld":"Uitrol uitgeschakeld")};return e.jsxs(pe,{title:"Instellingen",description:"Google Ads-accounts, klantprofiel voor de AI en de tokens waarmee het Google Ads Script veilig verbindt.",children:[e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsxs(oe,{value:c,onValueChange:b,children:[e.jsx(le,{className:"w-72",children:e.jsx(de,{placeholder:"Kies een account"})}),e.jsx(ce,{children:m.map(a=>e.jsx(ge,{value:a.id,children:a.display_name},a.id))})]}),e.jsxs(_,{variant:"outline",disabled:v,onClick:()=>A(),children:[e.jsx(W,{className:`h-4 w-4 mr-1 ${v?"animate-spin":""}`})," Account synchroniseren"]}),i&&e.jsxs(j,{variant:"outline",className:"border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",children:[e.jsx(X,{className:"mr-1 h-3.5 w-3.5"})," Verbonden"]})]}),e.jsxs(I,{className:"border-border/70 shadow-sm",children:[e.jsxs(S,{children:[e.jsx(T,{className:"text-base",children:"Verbonden account"}),e.jsx(R,{children:"Accountgegevens worden veilig en alleen-lezen vanuit de actieve Google Ads-koppeling bijgewerkt."})]}),e.jsxs(D,{className:"space-y-3",children:[e.jsxs("div",{className:"grid gap-3 sm:grid-cols-2",children:[e.jsxs("div",{children:[e.jsx(l,{children:"Weergavenaam"}),e.jsx(k,{value:g.display_name,readOnly:!0})]}),e.jsxs("div",{children:[e.jsx(l,{children:"Google klant-ID"}),e.jsx(k,{value:g.google_customer_id,readOnly:!0})]})]}),e.jsxs("div",{children:[e.jsx(l,{children:"Notities"}),e.jsx(u,{value:g.notes,onChange:a=>d(s=>({...s,notes:a.target.value})),rows:2})]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-3",children:[e.jsxs(_,{disabled:x.isPending||!g.display_name||!g.google_customer_id,onClick:()=>x.mutate({id:i==null?void 0:i.id,...g},{onSuccess:a=>{b(a.id),p.success("Notities opgeslagen")},onError:a=>p.error(a.message)}),children:[x.isPending&&e.jsx(L,{className:"h-4 w-4 mr-1 animate-spin"})," Notities opslaan"]}),i&&e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(ie,{checked:i.deployment_enabled,onCheckedChange:Z,id:"dep"}),e.jsx(l,{htmlFor:"dep",className:"text-sm",children:"Uitrol toestaan (alleen gepauzeerd)"})]}),i&&e.jsx(j,{variant:"outline",children:i.connection_status})]})]})]}),i&&e.jsxs(e.Fragment,{children:[e.jsx(Ce,{settings:i,hasActiveToken:U.some(a=>a.is_active)}),e.jsxs(I,{className:"border-border/70 shadow-sm",children:[e.jsxs(S,{children:[e.jsx(T,{className:"text-base",children:"Klantprofiel"}),e.jsx(R,{children:"Deze context stuurt straks de AI-generatie en de merkbewaking aan."})]}),e.jsxs(D,{className:"space-y-3",children:[e.jsxs("div",{className:"grid gap-3 sm:grid-cols-2",children:[e.jsxs("div",{children:[e.jsx(l,{children:"Website"}),e.jsx(k,{value:r.website,onChange:a=>o(s=>({...s,website:a.target.value}))})]}),e.jsxs("div",{children:[e.jsx(l,{children:"Merktoon"}),e.jsx(k,{value:r.brand_tone,onChange:a=>o(s=>({...s,brand_tone:a.target.value}))})]})]}),e.jsxs("div",{children:[e.jsx(l,{children:"Wat doet het bedrijf"}),e.jsx(u,{rows:2,value:r.business_description,onChange:a=>o(s=>({...s,business_description:a.target.value}))})]}),e.jsxs("div",{children:[e.jsx(l,{children:"Producten / diensten"}),e.jsx(u,{rows:2,value:r.products_services,onChange:a=>o(s=>({...s,products_services:a.target.value}))})]}),e.jsxs("div",{className:"grid gap-3 sm:grid-cols-2",children:[e.jsxs("div",{children:[e.jsx(l,{children:"Doelgroepen"}),e.jsx(u,{rows:2,value:r.target_audiences,onChange:a=>o(s=>({...s,target_audiences:a.target.value}))})]}),e.jsxs("div",{children:[e.jsx(l,{children:"Conversiedoelen"}),e.jsx(u,{rows:2,value:r.conversion_goals,onChange:a=>o(s=>({...s,conversion_goals:a.target.value}))})]})]}),e.jsxs("div",{className:"grid gap-3 sm:grid-cols-2",children:[e.jsxs("div",{children:[e.jsx(l,{children:"USP's (één per regel)"}),e.jsx(u,{rows:3,value:r.usps,onChange:a=>o(s=>({...s,usps:a.target.value}))})]}),e.jsxs("div",{children:[e.jsx(l,{children:"Gewenste CTA's (één per regel)"}),e.jsx(u,{rows:3,value:r.preferred_ctas,onChange:a=>o(s=>({...s,preferred_ctas:a.target.value}))})]})]}),e.jsxs("div",{className:"grid gap-3 sm:grid-cols-2",children:[e.jsxs("div",{children:[e.jsx(l,{children:"Verboden claims (één per regel)"}),e.jsx(u,{rows:3,value:r.prohibited_claims,onChange:a=>o(s=>({...s,prohibited_claims:a.target.value}))})]}),e.jsxs("div",{children:[e.jsx(l,{children:"Verboden woorden (één per regel)"}),e.jsx(u,{rows:3,value:r.prohibited_wording,onChange:a=>o(s=>({...s,prohibited_wording:a.target.value}))})]})]}),e.jsxs("div",{children:[e.jsx(l,{children:"Regels voor landingspagina's"}),e.jsx(u,{rows:2,value:r.landing_page_rules,onChange:a=>o(s=>({...s,landing_page_rules:a.target.value}))})]}),e.jsxs("div",{children:[e.jsx(l,{children:"Juridische aandachtspunten"}),e.jsx(u,{rows:2,value:r.legal_notes,onChange:a=>o(s=>({...s,legal_notes:a.target.value}))})]}),e.jsxs("div",{children:[e.jsx(l,{children:"Extra instructies voor de AI"}),e.jsx(u,{rows:2,value:r.ai_instructions,onChange:a=>o(s=>({...s,ai_instructions:a.target.value}))})]}),e.jsxs(_,{disabled:y.isPending,onClick:()=>y.mutate({...t!=null&&t.id?{id:t.id}:{},settings_id:i.id,website:r.website||null,brand_tone:r.brand_tone||null,business_description:r.business_description||null,products_services:r.products_services||null,target_audiences:r.target_audiences||null,conversion_goals:r.conversion_goals||null,landing_page_rules:r.landing_page_rules||null,legal_notes:r.legal_notes||null,ai_instructions:r.ai_instructions||null,usps:C(r.usps),preferred_ctas:C(r.preferred_ctas),prohibited_claims:C(r.prohibited_claims),prohibited_wording:C(r.prohibited_wording)},{onSuccess:()=>p.success("Profiel opgeslagen"),onError:a=>p.error(a.message)}),children:[y.isPending&&e.jsx(L,{className:"h-4 w-4 mr-1 animate-spin"})," Profiel opslaan"]})]})]}),e.jsxs(I,{className:"border-border/70 shadow-sm",children:[e.jsxs(S,{children:[e.jsxs(T,{className:"text-base flex items-center gap-2",children:[e.jsx(te,{className:"h-4 w-4"})," Script-tokens"]}),e.jsx(R,{children:"Het Google Ads Script authenticeert met een token. Alleen de hash wordt bewaard; de waarde zie je één keer."})]}),e.jsxs(D,{className:"space-y-3",children:[f&&e.jsxs(G,{children:[e.jsx(se,{className:"h-4 w-4"}),e.jsx(P,{children:"Nieuw token (eenmalig zichtbaar)"}),e.jsxs(O,{className:"space-y-2",children:[e.jsx("code",{className:"block break-all rounded bg-muted p-2 text-xs",children:f}),e.jsxs(_,{size:"sm",variant:"outline",onClick:()=>{navigator.clipboard.writeText(f),p.success("Gekopieerd")},children:[e.jsx(Y,{className:"h-3.5 w-3.5 mr-1"})," Kopiëren"]})]})]}),e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(k,{placeholder:"Naam, bijv. Script productie",value:N,onChange:a=>V(a.target.value),className:"max-w-xs"}),e.jsxs(_,{variant:"outline",disabled:F||!N.trim(),onClick:q,children:[F&&e.jsx(L,{className:"h-4 w-4 mr-1 animate-spin"})," Token aanmaken"]})]}),e.jsxs("div",{className:"divide-y rounded-md border",children:[U.length===0&&e.jsx("div",{className:"p-3 text-sm text-muted-foreground",children:"Nog geen tokens."}),U.map(a=>e.jsxs("div",{className:"flex items-center justify-between gap-2 p-3 text-sm",children:[e.jsxs("div",{children:[e.jsx("div",{className:"font-medium",children:a.name}),e.jsxs("div",{className:"text-xs text-muted-foreground",children:[a.token_prefix,"… · ",a.last_used_at?`laatst gebruikt ${new Date(a.last_used_at).toLocaleString("nl-NL")}`:"nog niet gebruikt"]})]}),a.is_active?e.jsx(_,{size:"sm",variant:"outline",onClick:()=>Q(a.id),children:"Intrekken"}):e.jsx(j,{variant:"outline",children:"Ingetrokken"})]},a.id))]})]})]})]})]})}export{Je as default};
