import{r as h,j as e,C as ge,bF as xe,cl as he,ah as I,a6 as ue,cm as fe,M as R,L as be,aJ as je,cn as ye,aQ as ke}from"./vendor-B534NquU.js";import{A as ve}from"./AdminLayout-DHrmiuIm.js";import{au as we,av as Ne,B as b,aw as Ce,v as H,w as A,r as m,aj as M,ak as P,a as k,D as q,x as J,y as G,z as Y,I as K}from"./index-DOZi0BK9.js";import{L as o}from"./label-DHgofTEF.js";import{S as w,a as N,b as C,c as T,e as Q,f as X,d as c}from"./select-BYALqOQ0.js";import{R as Te}from"./RichTextEmailEditor-CnHqJEa7.js";import{u as ze,a as He,b as Ee,c as Se,d as _e}from"./useEmailTemplates-Hj3h9P4y.js";import{S as $e}from"./switch-CNuRc_VT.js";import{T as Ae,a as Be,b as F,c as v,d as Oe,e as f}from"./table-9EQkGa3y.js";import{u as De}from"./useAdminTranslation-XROZMsAL.js";import"./index-CC1MlyrX.js";import"./ui-BWjmArZi.js";import"./separator-Y6_bJrDN.js";import"./skeleton-B7u1mOrG.js";import"./scroll-area-XJ4NVvvh.js";import"./admin-translations-DesajleG.js";import"./nl-CqKc2wvz.js";import"./tabs-C01ZicJo.js";const Z={"hek-kopen":{primaryColor:"#008080",accentColor:"#E86A33",brandName:"Hek-Kopen.nl",domain:"hek-kopen.nl",email:"info@hek-kopen.nl",phone:"085 130 57 11",logoUrl:"https://czxvxctbeyckligmmbgy.supabase.co/storage/v1/object/public/email-attachments/brand/logo-hek-kopen.png"},"hek-online":{primaryColor:"#1a472a",accentColor:"#d4a843",brandName:"Hek-Online.nl",domain:"hek-online.nl",email:"info@hek-online.nl",phone:"085 130 57 11",logoUrl:"https://czxvxctbeyckligmmbgy.supabase.co/storage/v1/object/public/email-attachments/brand/logo-hek-online.png"}};function x(t,r,E){const s=Z[t]||Z["hek-kopen"];return`<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#374151;background-color:#f3f4f6;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f3f4f6;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="width:600px;max-width:600px;background-color:#ffffff;border:1px solid #e5e7eb;border-collapse:collapse;">
          ${`<tr>
    <td bgcolor="${s.primaryColor}" style="background-color:${s.primaryColor};padding:32px 24px;text-align:center;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0 auto;background-color:#ffffff;border-radius:6px;">
        <tr>
          <td bgcolor="#ffffff" style="background-color:#ffffff;padding:14px 22px;border-radius:6px;">
            <img src="${s.logoUrl}" alt="${s.brandName}" width="180" style="display:block;max-width:180px;height:auto;border:0;outline:none;" />
          </td>
        </tr>
      </table>
      ${r?`<h1 style="margin:18px 0 0;color:#ffffff;font-size:20px;font-weight:600;font-family:Arial,Helvetica,sans-serif;letter-spacing:0;">${r}</h1>`:""}
    </td>
  </tr>
  <tr>
    <td bgcolor="${s.accentColor}" height="3" style="background-color:${s.accentColor};height:3px;line-height:3px;font-size:0;">&nbsp;</td>
  </tr>`}
          <tr>
            <td style="padding:32px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#374151;">
              ${E}
            </td>
          </tr>
          <tr>
            <td bgcolor="#f9fafb" style="background-color:#f9fafb;padding:20px 24px;border-top:1px solid #e5e7eb;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="width:100%;">
                <tr>
                  <td width="50%" valign="middle" style="width:50%;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6b7280;">
                    <img src="${s.logoUrl}" alt="${s.brandName}" width="80" style="display:block;max-width:80px;height:auto;border:0;outline:none;margin-bottom:6px;" />
                    <strong style="color:#374151;">${s.brandName}</strong>
                  </td>
                  <td width="50%" valign="middle" align="right" style="width:50%;text-align:right;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6b7280;line-height:1.6;">
                    <a href="mailto:${s.email}" style="color:${s.primaryColor};text-decoration:none;">${s.email}</a><br>
                    ${s.phone}<br>
                    <a href="https://${s.domain}" style="color:${s.primaryColor};text-decoration:none;">www.${s.domain}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`}const U={"hk-blank":{name:"Leeg",brand:"Hek-Kopen",html:x("hek-kopen","",`<p>Beste {{naam}},</p>
       <p>Jouw bericht hier...</p>
       <p>Met vriendelijke groet,<br>{{afzender_naam}}</p>`)},"hk-welcome":{name:"Welkomstmail",brand:"Hek-Kopen",html:x("hek-kopen","Welkom bij Hek-Kopen.nl",`<p style="margin:0 0 20px;">Beste {{naam}},</p>
       <p style="margin:0 0 20px;">Hartelijk dank voor uw aanvraag! We hebben uw bericht in goede orde ontvangen en nemen zo snel mogelijk contact met u op.</p>
       <p style="margin:0 0 20px;">Bij Hek-Kopen.nl staan we voor kwaliteit, persoonlijke service en scherpe prijzen. Heeft u in de tussentijd vragen? Neem gerust contact met ons op.</p>
       <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:30px 0;">
         <tr>
           <td style="background-color:#008080;border-radius:6px;">
             <a href="https://hek-kopen.nl" style="display:inline-block;padding:14px 30px;color:#ffffff;text-decoration:none;font-weight:bold;">Bekijk ons aanbod</a>
           </td>
         </tr>
       </table>
       <p style="margin:0;">Met vriendelijke groet,<br><strong>{{afzender_naam}}</strong></p>`)},"hk-followup":{name:"Follow-up",brand:"Hek-Kopen",html:x("hek-kopen","",`<p style="margin:0 0 20px;">Beste {{naam}},</p>
       <p style="margin:0 0 20px;">Een paar dagen geleden heeft u contact met ons opgenomen. We wilden even checken of u nog vragen heeft of dat we u ergens mee kunnen helpen.</p>
       <p style="margin:0 0 20px;">Misschien heeft u nog twijfels of wilt u meer informatie over onze producten? We staan klaar om u te adviseren!</p>
       <p style="margin:0 0 10px;"><strong>U kunt ons bereiken via:</strong></p>
       <ul style="margin:0 0 20px;padding-left:20px;">
         <li>Email: info@hek-kopen.nl</li>
         <li>Website: www.hek-kopen.nl</li>
       </ul>
       <p style="margin:0;">Met vriendelijke groet,<br><strong>{{afzender_naam}}</strong></p>`)},"hk-quote":{name:"Offerte",brand:"Hek-Kopen",html:x("hek-kopen","Uw Offerte",`<p style="margin:0 0 20px;">Beste {{naam}},</p>
       <p style="margin:0 0 20px;">Hierbij ontvangt u onze offerte zoals besproken. We hebben ons best gedaan om u een scherpe prijs te bieden voor de gewenste producten.</p>
       <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:20px 0;background-color:#f8f8f8;border-radius:8px;">
         <tr>
           <td style="padding:20px;">
             <p style="margin:0 0 10px;font-size:14px;color:#666;">Totaalbedrag:</p>
             <p style="margin:0;font-size:28px;font-weight:bold;color:#008080;">€{{offerte_bedrag}}</p>
             <p style="margin:10px 0 0;font-size:12px;color:#666;">Inclusief BTW</p>
           </td>
         </tr>
       </table>
       <p style="margin:0 0 20px;">Deze offerte is 14 dagen geldig. Heeft u vragen of wilt u de bestelling plaatsen? Neem dan contact met ons op!</p>
       <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:30px 0;">
         <tr>
           <td style="background-color:#008080;border-radius:6px;">
             <a href="https://hek-kopen.nl/contact" style="display:inline-block;padding:14px 30px;color:#ffffff;text-decoration:none;font-weight:bold;">Contact opnemen</a>
           </td>
         </tr>
       </table>
       <p style="margin:0;">Met vriendelijke groet,<br><strong>{{afzender_naam}}</strong></p>`)},"ho-blank":{name:"Leeg",brand:"Hek-Online",html:x("hek-online","",`<p>Beste {{naam}},</p>
       <p>Jouw bericht hier...</p>
       <p>Met vriendelijke groet,<br>{{afzender_naam}}</p>`)},"ho-welcome":{name:"Welkomstmail",brand:"Hek-Online",html:x("hek-online","Welkom bij Hek-Online.nl",`<p style="margin:0 0 20px;">Beste {{naam}},</p>
       <p style="margin:0 0 20px;">Hartelijk dank voor uw aanvraag! We hebben uw bericht in goede orde ontvangen en nemen zo snel mogelijk contact met u op.</p>
       <p style="margin:0 0 20px;">Bij Hek-Online.nl bieden wij maatwerk hekwerk van hoge kwaliteit. Heeft u in de tussentijd vragen? Neem gerust contact met ons op.</p>
       <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:30px 0;">
         <tr>
           <td style="background-color:#1a472a;border-radius:6px;">
             <a href="https://hek-online.nl" style="display:inline-block;padding:14px 30px;color:#ffffff;text-decoration:none;font-weight:bold;">Bekijk ons aanbod</a>
           </td>
         </tr>
       </table>
       <p style="margin:0;">Met vriendelijke groet,<br><strong>{{afzender_naam}}</strong></p>`)},"ho-followup":{name:"Follow-up",brand:"Hek-Online",html:x("hek-online","",`<p style="margin:0 0 20px;">Beste {{naam}},</p>
       <p style="margin:0 0 20px;">Een paar dagen geleden heeft u contact met ons opgenomen. We wilden even checken of u nog vragen heeft of dat we u ergens mee kunnen helpen.</p>
       <p style="margin:0 0 20px;">Misschien heeft u nog twijfels of wilt u meer informatie over onze producten? We staan klaar om u te adviseren!</p>
       <p style="margin:0 0 10px;"><strong>U kunt ons bereiken via:</strong></p>
       <ul style="margin:0 0 20px;padding-left:20px;">
         <li>Email: info@hek-online.nl</li>
         <li>Website: www.hek-online.nl</li>
       </ul>
       <p style="margin:0;">Met vriendelijke groet,<br><strong>{{afzender_naam}}</strong></p>`)},"ho-quote":{name:"Offerte",brand:"Hek-Online",html:x("hek-online","Uw Offerte",`<p style="margin:0 0 20px;">Beste {{naam}},</p>
       <p style="margin:0 0 20px;">Hierbij ontvangt u onze offerte zoals besproken. We hebben ons best gedaan om u een scherpe prijs te bieden voor het gewenste maatwerk hekwerk.</p>
       <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:20px 0;background-color:#f8f8f8;border-radius:8px;">
         <tr>
           <td style="padding:20px;">
             <p style="margin:0 0 10px;font-size:14px;color:#666;">Totaalbedrag:</p>
             <p style="margin:0;font-size:28px;font-weight:bold;color:#1a472a;">€{{offerte_bedrag}}</p>
             <p style="margin:10px 0 0;font-size:12px;color:#666;">Inclusief BTW</p>
           </td>
         </tr>
       </table>
       <p style="margin:0 0 20px;">Deze offerte is 14 dagen geldig. Heeft u vragen of wilt u de bestelling plaatsen? Neem dan contact met ons op!</p>
       <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:30px 0;">
         <tr>
           <td style="background-color:#1a472a;border-radius:6px;">
             <a href="https://hek-online.nl/contact" style="display:inline-block;padding:14px 30px;color:#ffffff;text-decoration:none;font-weight:bold;">Contact opnemen</a>
           </td>
         </tr>
       </table>
       <p style="margin:0;">Met vriendelijke groet,<br><strong>{{afzender_naam}}</strong></p>`)}},ee=[{key:"naam",description:"Naam van de klant"},{key:"email",description:"Email van de klant"},{key:"telefoon",description:"Telefoonnummer"},{key:"offerte_bedrag",description:"Offerte bedrag"},{key:"product_type",description:"Type product"},{key:"bedrijf",description:"Bedrijfsnaam"},{key:"afzender_naam",description:"Naam afzender (Joris/Maarten/Richard)"}];function Le({value:t,onChange:r,subject:E,onSubjectChange:s}){const[z,j]=h.useState(null),B=n=>{const i=U[n];i&&(r(i.html),m.success(`Template "${i.brand} - ${i.name}" geladen`))},O=n=>{const i=`{{${n}}}`;r(t+i),j(n),setTimeout(()=>j(null),1500)},u=n=>{navigator.clipboard.writeText(`{{${n}}}`),j(n),m.success("Variabele gekopieerd"),setTimeout(()=>j(null),1500)},D=Object.entries(U).filter(([,n])=>n.brand==="Hek-Kopen"),S=Object.entries(U).filter(([,n])=>n.brand==="Hek-Online");return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex flex-wrap items-center gap-2 p-3 bg-muted rounded-lg",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(o,{className:"text-sm font-medium",children:"Template:"}),e.jsxs(w,{onValueChange:B,children:[e.jsx(N,{className:"w-48 h-8",children:e.jsx(C,{placeholder:"Kies template"})}),e.jsxs(T,{children:[e.jsxs(Q,{children:[e.jsx(X,{children:"🟢 Hek-Kopen"}),D.map(([n,i])=>e.jsxs(c,{value:n,children:["HK - ",i.name]},n))]}),e.jsxs(Q,{children:[e.jsx(X,{children:"🌲 Hek-Online"}),S.map(([n,i])=>e.jsxs(c,{value:n,children:["HO - ",i.name]},n))]})]})]})]}),e.jsx("div",{className:"h-6 w-px bg-border"}),e.jsxs("div",{className:"flex items-center gap-1",children:[e.jsx(o,{className:"text-sm font-medium mr-2",children:"Variabelen:"}),ee.slice(0,4).map(n=>e.jsxs(we,{children:[e.jsx(Ne,{asChild:!0,children:e.jsxs(b,{variant:"outline",size:"sm",className:"h-7 text-xs font-mono",onClick:()=>u(n.key),children:[z===n.key?e.jsx(ge,{className:"h-3 w-3 mr-1"}):e.jsx(xe,{className:"h-3 w-3 mr-1"}),`{{${n.key}}}`]})}),e.jsx(Ce,{children:n.description})]},n.key)),e.jsxs(w,{onValueChange:O,children:[e.jsx(N,{className:"w-24 h-7 text-xs",children:e.jsx(C,{placeholder:"Meer..."})}),e.jsx(T,{children:ee.map(n=>e.jsxs(c,{value:n.key,children:[e.jsx("span",{className:"font-mono",children:`{{${n.key}}}`}),e.jsx("span",{className:"ml-2 text-muted-foreground text-xs",children:n.description})]},n.key))})]})]})]}),e.jsx(Te,{value:t,onChange:r}),e.jsx(H,{className:"bg-primary/5 border-primary/20",children:e.jsxs(A,{className:"p-4",children:[e.jsxs("h4",{className:"font-medium text-sm mb-2 flex items-center gap-2",children:[e.jsx(he,{className:"h-4 w-4 text-primary"}),"Tips voor hoge deliverability"]}),e.jsxs("ul",{className:"text-xs text-muted-foreground space-y-1",children:[e.jsx("li",{children:"✓ Gebruik alleen inline CSS styles (geen <style> tags)"}),e.jsx("li",{children:"✓ Gebruik table-based layouts voor consistente weergave"}),e.jsx("li",{children:"✓ Vermijd grote afbeeldingen en te veel links"}),e.jsx("li",{children:"✓ Houd de onderwerpregel kort en relevant"}),e.jsx("li",{children:"✓ Voeg altijd een duidelijke afzender toe"})]})]})})]})}const Ve={welcome:"bg-primary/10 text-primary",followup:"bg-secondary text-secondary-foreground",quote:"bg-accent text-accent-foreground",reminder:"bg-muted text-muted-foreground",winback:"bg-destructive/10 text-destructive",custom:"bg-muted text-muted-foreground",order:"bg-blue-100 text-blue-800",service:"bg-purple-100 text-purple-800",delivery:"bg-orange-100 text-orange-800",payment:"bg-green-100 text-green-800",installation:"bg-teal-100 text-teal-800",feedback:"bg-yellow-100 text-yellow-800",newsletter:"bg-indigo-100 text-indigo-800",promotion:"bg-pink-100 text-pink-800",warranty:"bg-slate-100 text-slate-800",appointment:"bg-cyan-100 text-cyan-800"},_={nl:"Nederlands",de:"Deutsch",be:"Belgisch",en:"English"},$={nl:"🇳🇱",de:"🇩🇪",be:"🇧🇪",en:"🇬🇧"},ae=["welcome","followup","quote","reminder","winback","custom","order","service","delivery","payment","installation","feedback","newsletter","promotion","warranty","appointment"],te=["nl","de","be","en"],ne={name:"",subject:"",html_content:"",category:"custom",language:"nl",variables:""};function na(){const{t}=De(),{data:r,isLoading:E}=ze(),s=He(),z=Ee(),j=Se(),B=_e(),[O,u]=h.useState(!1),[D,S]=h.useState(!1),[n,i]=h.useState(null),[d,le]=h.useState(null),[l,p]=h.useState(ne),[L,se]=h.useState("all"),[V,re]=h.useState("all"),W=a=>t(`templates.categoryLabels.${a}`),y=r==null?void 0:r.filter(a=>(L==="all"||a.language===L)&&(V==="all"||a.brand===V)),ie=()=>{i(null),p(ne),u(!0)},oe=a=>{i(a),p({name:a.name,subject:a.subject,html_content:a.html_content,category:a.category,language:a.language||"nl",variables:a.variables.join(", ")}),u(!0)},ce=a=>{le(a),S(!0)},de=async()=>{try{const a=l.variables.split(",").map(g=>g.trim()).filter(g=>g.length>0);n?(await z.mutateAsync({id:n.id,name:l.name,subject:l.subject,html_content:l.html_content,category:l.category,language:l.language,variables:a}),m.success(t("templates.templateUpdated"))):(await s.mutateAsync({name:l.name,subject:l.subject,html_content:l.html_content,category:l.category,language:l.language,variables:a}),m.success(t("templates.templateCreated"))),u(!1)}catch{m.error(t("templates.saveError"))}},me=async a=>{if(confirm(t("templates.confirmDelete")))try{await j.mutateAsync(a),m.success(t("templates.templateDeleted"))}catch{m.error(t("templates.deleteError"))}},pe=async(a,g)=>{try{await B.mutateAsync({id:a,is_active:g}),m.success(t(g?"templates.templateActivated":"templates.templateDeactivated"))}catch{m.error(t("templates.statusError"))}};return e.jsx(ve,{children:e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsxs("h1",{className:"text-2xl font-bold text-foreground flex items-center gap-2",children:[e.jsx(I,{className:"h-6 w-6 text-primary"}),t("templates.title")]}),e.jsx("p",{className:"text-muted-foreground",children:t("templates.subtitle")})]}),e.jsxs(b,{onClick:ie,children:[e.jsx(ue,{className:"h-4 w-4 mr-2"}),t("templates.newTemplate")]})]}),e.jsxs("div",{className:"grid gap-4 md:grid-cols-3",children:[e.jsxs(H,{children:[e.jsx(M,{className:"pb-2",children:e.jsx(P,{className:"text-sm font-medium",children:t("templates.templates")})}),e.jsxs(A,{children:[e.jsx("div",{className:"text-2xl font-bold",children:(r==null?void 0:r.length)||0}),e.jsxs("p",{className:"text-xs text-muted-foreground",children:[(r==null?void 0:r.filter(a=>a.is_active).length)||0," ",t("templates.active")]})]})]}),e.jsxs(H,{children:[e.jsx(M,{className:"pb-2",children:e.jsx(P,{className:"text-sm font-medium",children:t("templates.categories")})}),e.jsx(A,{children:e.jsx("div",{className:"flex flex-wrap gap-1",children:ae.slice(0,4).map(a=>e.jsx(k,{variant:"outline",className:"text-xs",children:W(a)},a))})})]}),e.jsxs(H,{children:[e.jsx(M,{className:"pb-2",children:e.jsx(P,{className:"text-sm font-medium",children:t("templates.variables")})}),e.jsx(A,{children:e.jsxs("div",{className:"flex flex-wrap gap-1",children:[["naam","email","offerte_bedrag"].map(a=>e.jsx(k,{variant:"secondary",className:"font-mono text-xs",children:`{{${a}}}`},a)),e.jsxs(k,{variant:"outline",className:"text-xs",children:["+3 ",t("templates.more")]})]})})]})]}),e.jsxs("div",{className:"flex items-center gap-4 flex-wrap",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(fe,{className:"h-4 w-4 text-muted-foreground"}),e.jsxs(w,{value:L,onValueChange:se,children:[e.jsx(N,{className:"w-48",children:e.jsx(C,{placeholder:t("templates.selectLanguage")})}),e.jsxs(T,{children:[e.jsx(c,{value:"all",children:t("common.allStatuses").replace("statussen","talen")}),te.map(a=>e.jsxs(c,{value:a,children:[$[a]," ",_[a]]},a))]})]})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(R,{className:"h-4 w-4 text-muted-foreground"}),e.jsxs(w,{value:V,onValueChange:re,children:[e.jsx(N,{className:"w-48",children:e.jsx(C,{placeholder:"Filter op merk"})}),e.jsxs(T,{children:[e.jsx(c,{value:"all",children:"Alle merken"}),e.jsx(c,{value:"hek-kopen",children:"Hek-Kopen"}),e.jsx(c,{value:"hek-online",children:"Hek-Online"})]})]})]})]}),E?e.jsx("div",{className:"flex items-center justify-center py-12",children:e.jsx(be,{className:"h-8 w-8 animate-spin text-muted-foreground"})}):e.jsx(H,{children:e.jsxs(Ae,{children:[e.jsx(Be,{children:e.jsxs(F,{children:[e.jsx(v,{children:t("templates.name")}),e.jsx(v,{children:t("templates.subject")}),e.jsx(v,{children:t("templates.language")}),e.jsx(v,{children:t("templates.category")}),e.jsx(v,{children:t("templates.active")}),e.jsx(v,{className:"text-right",children:t("templates.actions")})]})}),e.jsxs(Oe,{children:[y==null?void 0:y.map(a=>e.jsxs(F,{children:[e.jsx(f,{className:"font-medium",children:a.name}),e.jsx(f,{className:"text-muted-foreground max-w-xs truncate",children:a.subject}),e.jsx(f,{children:e.jsxs(k,{variant:"outline",className:"gap-1",children:[$[a.language||"nl"]," ",_[a.language||"nl"]]})}),e.jsx(f,{children:e.jsx(k,{className:Ve[a.category],children:W(a.category)})}),e.jsx(f,{children:e.jsx($e,{checked:a.is_active,onCheckedChange:g=>pe(a.id,g)})}),e.jsx(f,{className:"text-right",children:e.jsxs("div",{className:"flex items-center justify-end gap-2",children:[e.jsx(b,{variant:"ghost",size:"icon",onClick:()=>ce(a),children:e.jsx(je,{className:"h-4 w-4"})}),e.jsx(b,{variant:"ghost",size:"icon",onClick:()=>oe(a),children:e.jsx(ye,{className:"h-4 w-4"})}),e.jsx(b,{variant:"ghost",size:"icon",className:"text-destructive",onClick:()=>me(a.id),children:e.jsx(ke,{className:"h-4 w-4"})})]})})]},a.id)),(y==null?void 0:y.length)===0&&e.jsx(F,{children:e.jsx(f,{colSpan:6,className:"text-center py-8 text-muted-foreground",children:t("templates.noTemplates")})})]})]})}),e.jsx(q,{open:O,onOpenChange:u,children:e.jsxs(J,{className:"max-w-5xl max-h-[95vh] overflow-y-auto",children:[e.jsx(G,{children:e.jsxs(Y,{className:"flex items-center gap-2",children:[e.jsx(I,{className:"h-5 w-5 text-primary"}),t(n?"templates.editTemplate":"templates.createTemplate")]})}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"grid grid-cols-4 gap-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsxs(o,{children:[t("templates.templateName")," *"]}),e.jsx(K,{value:l.name,onChange:a=>p({...l,name:a.target.value}),placeholder:t("templates.templateNamePlaceholder")})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs(o,{children:[t("templates.language")," *"]}),e.jsxs(w,{value:l.language,onValueChange:a=>p({...l,language:a}),children:[e.jsx(N,{children:e.jsx(C,{})}),e.jsx(T,{children:te.map(a=>e.jsxs(c,{value:a,children:[$[a]," ",_[a]]},a))})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs(o,{children:[t("templates.category")," *"]}),e.jsxs(w,{value:l.category,onValueChange:a=>p({...l,category:a}),children:[e.jsx(N,{children:e.jsx(C,{})}),e.jsx(T,{children:ae.map(a=>e.jsx(c,{value:a,children:W(a)},a))})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(o,{children:t("templates.variablesLabel")}),e.jsx(K,{value:l.variables,onChange:a=>p({...l,variables:a.target.value}),placeholder:t("templates.variablesPlaceholder")})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs(o,{children:[t("templates.subject")," *"]}),e.jsx(K,{value:l.subject,onChange:a=>p({...l,subject:a.target.value}),placeholder:t("templates.subjectPlaceholder")})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs(o,{children:[t("templates.emailContent")," *"]}),e.jsx(Le,{value:l.html_content,onChange:a=>p({...l,html_content:a})})]}),e.jsxs("div",{className:"flex justify-end gap-2 pt-4 border-t",children:[e.jsx(b,{variant:"outline",onClick:()=>u(!1),children:t("common.cancel")}),e.jsx(b,{onClick:de,disabled:s.isPending||z.isPending,children:t(n?"common.update":"common.create")})]})]})]})}),e.jsx(q,{open:D,onOpenChange:S,children:e.jsxs(J,{className:"max-w-4xl max-h-[90vh] overflow-hidden flex flex-col",children:[e.jsx(G,{children:e.jsxs(Y,{className:"flex items-center gap-2",children:[e.jsx(R,{className:"h-5 w-5 text-primary"}),t("templates.preview"),": ",d==null?void 0:d.name]})}),d&&e.jsxs("div",{className:"space-y-4 flex-1 overflow-hidden flex flex-col",children:[e.jsxs("div",{className:"grid grid-cols-3 gap-4",children:[e.jsxs("div",{children:[e.jsx(o,{className:"text-muted-foreground text-xs",children:t("templates.subject")}),e.jsx("p",{className:"font-medium text-sm",children:d.subject})]}),e.jsxs("div",{children:[e.jsx(o,{className:"text-muted-foreground text-xs",children:t("templates.language")}),e.jsxs("p",{className:"font-medium text-sm",children:[$[d.language||"nl"]," ",_[d.language||"nl"]]})]}),e.jsxs("div",{children:[e.jsx(o,{className:"text-muted-foreground text-xs",children:t("templates.variables")}),e.jsx("div",{className:"flex flex-wrap gap-1 mt-1",children:d.variables.map(a=>e.jsx(k,{variant:"outline",className:"font-mono text-xs",children:`{{${a}}}`},a))})]})]}),e.jsxs("div",{className:"flex-1 overflow-hidden border rounded-lg",children:[e.jsxs("div",{className:"bg-muted/50 px-4 py-2 border-b flex items-center gap-2",children:[e.jsxs("div",{className:"flex gap-1.5",children:[e.jsx("div",{className:"w-3 h-3 rounded-full bg-destructive/60"}),e.jsx("div",{className:"w-3 h-3 rounded-full bg-warning/60"}),e.jsx("div",{className:"w-3 h-3 rounded-full bg-success/60"})]}),e.jsx("span",{className:"text-xs text-muted-foreground ml-2",children:t("templates.emailPreview")})]}),e.jsx("iframe",{srcDoc:d.html_content.replace(/\{\{naam\}\}/g,"Jan de Vries").replace(/\{\{email\}\}/g,"jan@voorbeeld.nl").replace(/\{\{telefoon\}\}/g,"06-12345678").replace(/\{\{offerte_bedrag\}\}/g,"1.250,00").replace(/\{\{product_type\}\}/g,"Dubbelstaafmat hekwerk").replace(/\{\{bedrijf\}\}/g,"Voorbeeld BV"),className:"w-full h-[500px] bg-white border-0",title:t("templates.emailPreview"),sandbox:"allow-same-origin"})]})]})]})})]})})}export{na as default};
