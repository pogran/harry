import React from 'react'
import Script from 'next/script'

export const Metrics = () => {
  return (
    <React.Fragment>
      {/* <!-- Yandex.Metrika counter --> */}
      <Script id="yandex-analytics" strategy="afterInteractive">
        {`
						(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
						var z = null;m[i].l=1*new Date();
						for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
						k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
						(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
		
						ym(${+process.env.NEXT_PUBLIC_ENV_YANDEX_METRICS_ID}, "init", {
							clickmap:true,
							trackLinks:true,
							accurateTrackBounce:true,
							webvisor:true
						});
					`}
      </Script>

      {/* <!-- Google tag (gtag.js) --> */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_ENV_GOOGLE_ANALYTICS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());

						gtag('config', '${process.env.NEXT_PUBLIC_ENV_GOOGLE_ANALYTICS_ID}');
					`}
      </Script>
    </React.Fragment>
  )
}
