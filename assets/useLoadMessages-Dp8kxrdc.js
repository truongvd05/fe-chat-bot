import{j as r,m as g,D as x,a as p,r as s,E as h,t as b}from"./index-CMUHzDma.js";function y({className:e,...t}){return r.jsx("textarea",{"data-slot":"textarea",className:g("border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",e),...t})}function w({message:e,right:t,user:a}){const{theme:n}=x();return r.jsxs(r.Fragment,{children:[r.jsx("div",{className:`
            ${t?"flex justify-end ml-auto":"flex"} 
            w-[80%]
            `,children:r.jsx("p",{className:`
                    break-all whitespace-pre-wrap
                    ${a&&n==="light"?"bg-olive-100 ":""}
                    ${t?"border border-white":""}
                    px-2 py-3 rounded-2xl
                    `,children:e.content})}),e.status==="sending"&&r.jsx("span",{className:"text-xs text-gray-400 ml-2",children:"Đang gửi..."})]})}function j(e,t){const a=p(),n=s.useRef(t),u=s.useRef(!0),o=s.useRef(!1),[c]=h();return s.useEffect(()=>{n.current=t},[t]),s.useEffect(()=>{u.current=!0},[e]),{loadMore:s.useCallback(async()=>{if(!u.current||o.current)return;const l=n.current;if(!l?.length)return;const d=l[0];o.current=!0;try{const i=await c({conversationId:e,c:d.createdAt}).unwrap();i.length<10&&(u.current=!1),a(b.util.updateQueryData("getMessage",{conversationId:e},f=>{f.unshift(...i)}))}catch(i){console.log(i)}finally{o.current=!1}},[e,a,c])}}export{w as M,y as T,j as u};
