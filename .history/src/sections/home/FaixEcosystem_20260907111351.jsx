// import { useLayoutEffect, useRef } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// export default function FaixEcosystem() {
//   const sectionRef = useRef(null);

//   const details = [
//     {
//       title: "Investment Currency",
//       text: "Use FAIX to invest in physical property fractions and fund pools seamlessly.",
//     },
//     {
//       title: "Staking Rewards",
//       text: "Earn up to 5.2% APY system-wide by locking FAIX into reserve vaults.",
//     },
//     {
//       title: "Governance Rights",
//       text: "Vote on crucial syndicate asset purchases and real-estate listings.",
//     },
//     {
//       title: "E-Commerce Luxury Portal",
//       text: "Procure physical tier-1 assets directly using the system FAIX liquidity.",
//     },
//   ];

//   const metrics = [
//     ["Circulating Supply", "120M FAIX"],
//     ["Total Supply", "500M FAIX"],
//     ["Market Cap", "$96.0M USD"],
//     ["24h Volume", "$2.1M USD"],
//     ["Current Price", "$0.80 FAIX"],
//     ["All-Time High", "$1.24 FAIX"],
//   ];

//   useLayoutEffect(() => {
//     const ctx = gsap.context(() => {
//       const tl = gsap.timeline({
//         scrollTrigger: {
//           trigger: sectionRef.current,
//           start: "top 75%",
//           toggleActions: "play none none none",
//         },
//         defaults: {
//           ease: "power3.out",
//         },
//       });

//       tl.from(".faix-heading", {
//         y: 40,
//         opacity: 0,
//         duration: 0.9,
//       })
//         .from(
//           ".faix-visual",
//           {
//             y: 30,
//             opacity: 0,
//             duration: 0.8,
//           },
//           "-=0.5"
//         )
//         .from(
//           ".faix-detail",
//           {
//             y: 20,
//             opacity: 0,
//             duration: 0.6,
//             stagger: 0.1,
//           },
//           "-=0.5"
//         )
//         .from(
//           ".faix-metric",
//           {
//             y: 20,
//             opacity: 0,
//             duration: 0.6,
//             stagger: 0.08,
//           },
//           "-=0.4"
//         );
//     }, sectionRef);

//     return () => ctx.revert();
//   }, []);

//   return (
//     <section
//       ref={sectionRef}
//       className="relative min-h-[720px] overflow-hidden bg-[#0A0A0A] text-white"
//     >
//      <div className="mx-auto w-full max-w-[1440px] px-5 py-14 sm:px-6 sm:py-16 lg:px-[80px] lg:py-[80px]">
//         <h2 className="faix-heading font-['Instrument_Serif'] text-[34px] font-normal leading-[1.05] text-[#FFFFFF] sm:text-[40px] lg:text-[48px]">
//           FAIX — The Currency of Tokenized Wealth
//         </h2>

//         <div className="mt-8 grid grid-cols-1 items-center gap-8 sm:mt-10 lg:grid-cols-[480px_1fr] lg:gap-[48px]">
//         <div className="relative h-[260px] w-full overflow-hidden rounded-[24px] border-[2px] border-[#D4A853]/25 bg-[#0A0A0A]/50 sm:h-[320px] lg:w-[480px]">
//           <img
//             src="/images/faix-coin-bg-export.png"
//             alt="FAIX token visualization"
//             className="h-full w-full object-cover"
//             />

//            <div className="absolute left-1/2 top-1/2 h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-[#D4A853] bg-[#1A3C34]/80 shadow-[0_0_40px_0_#D4A853] sm:h-[160px] sm:w-[160px]" />
//             </div>

//           <div className="flex flex-col gap-[16px]">
//             {details.map((item) => (
//               <div key={item.title} className="faix-detail">
//                <h3 className="font-['Instrument_Serif'] text-[17px] font-normal leading-[1.1] text-[#D4A853]">
//                   {item.title}
//                 </h3>

//                 <p className="mt-[5px] max-w-[690px] text-[13px] leading-[1.45] text-[#8F9A96]">
//                   {item.text}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-[40px] sm:gap-[16px] md:grid-cols-3 lg:grid-cols-6">
//           {metrics.map(([label, value]) => (
//             <div
//               key={label}
//               className="faix-metric h-[70px] rounded-[8px] border border-white/[0.08] bg-[#121614] px-[14px] py-[12px]"
//             >
//               <p className="text-[9px] leading-[1.2] text-[#8F9A96]">
//                 {label}
//               </p>

//               <p className="mt-[7px] whitespace-nowrap font-mono text-[14px] font-semibold text-[#D4A853] sm:text-[18px]">
//                 {value}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }