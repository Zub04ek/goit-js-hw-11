const t=document.querySelector("body"),e=document.querySelector("button[data-start]"),n=document.querySelector("button[data-stop]");e.addEventListener("click",(function(){o=setInterval((()=>{const e=`#${Math.floor(16777215*Math.random()).toString(16)}`;t.style.backgroundColor=e}),1e3),e.disabled=!0,n.disabled=!1})),n.addEventListener("click",(function(){clearInterval(o),e.disabled=!1,n.disabled=!0}));let o=null;
//# sourceMappingURL=index.64743282.js.map
