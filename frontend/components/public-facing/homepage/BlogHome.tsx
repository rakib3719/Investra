"use client";

import React from "react";
import Image from "next/image";
import { CiCalendar } from "react-icons/ci";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FiArrowRight } from "react-icons/fi";

interface BlogPost {
  id: number;
  title: string;
  date: string;
  views: string;
  description: string;
  image: string;
  category: string;
}

const blogData: BlogPost[] = [
  {
    id: 1,
    title: "The Economics of Forestry: Capturing High Yields from Standing Trees",
    date: "July 24, 2026",
    views: "2.4K",
    description: "Timberlands have historically outperformed standard equity markets during high-inflation periods. Discover how FSC-managed forests generate steady returns through sustainable logging and verified carbon offset credits.",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
    category: "Forestry"
  },
  {
    id: 2,
    title: "Decoding Carbon Offsets: A Guide for Modern Investment Portfolios",
    date: "July 18, 2026",
    views: "3.1K",
    description: "Understanding voluntary carbon markets is essential for ESG compliance and forward-thinking asset allocation.",
    image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&w=600&q=80",
    category: "Carbon Markets"
  },
  {
    id: 3,
    title: "Solar Infrastructure: Generating Predictable Dividends in 2026",
    date: "July 12, 2026",
    views: "1.8K",
    description: "Grid-scale battery backups and power purchase agreements make solar arrays the backbone of recurring income.",
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=600&q=80",
    category: "Solar Energy"
  }
];

const BlogHome = () => {
  return (
    <section className="w-full bg-white py-[55px] md:py-[89px] border-b border-slate-100 relative overflow-hidden">
      
      <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px]">
        
        {/* Header Section: Golden Ratio 1.618fr : 1fr Split */}
        <div className="grid grid-cols-1 md:grid-cols-[1.618fr_1fr] items-end justify-between gap-[26px] mb-[42px]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#064e3b] font-heading">
              Latest Insights • Thought Leadership
            </span>
            <h2 className="text-[34px] md:text-[42px] font-heading font-black text-[#1e293b] leading-[1.15] mt-2">
              Your Go-To Resource for <span className="text-[#064e3b] italic">Sustainable Wealth</span>
            </h2>
          </div>
          <div>
            <p className="text-[13px] md:text-[14px] text-slate-600 leading-[24px] font-body">
              Stay ahead with financial analyses, regulatory ESG changes, and real performance metrics from eco-friendly projects worldwide.
            </p>
          </div>
        </div>

        {/* Blogs Grid: Golden Ratio Split (1fr : 1.618fr) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.618fr] gap-[26px] lg:gap-[34px] items-stretch">
          
          {/* Left Column - Large Main Blog Post (38.2% space on desktop) */}
          <article className="border border-slate-200/80 rounded-[26px] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between bg-slate-50/40 group">
            <div className="space-y-[16px]">
              {/* Image box: Golden Rectangle Aspect Ratio */}
              <div className="w-full aspect-[1.618/1] relative overflow-hidden bg-slate-100 border-b border-slate-200/80">
                <Image
                  alt={blogData[0].title}
                  src={blogData[0].image}
                  fill
                  sizes="(max-w-768px) 100vw, 40vw"
                  className="object-cover transition-transform duration-[1s] group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs text-[#064e3b] text-[10px] font-heading font-bold px-[10px] py-[4px] rounded-full shadow-xs">
                  {blogData[0].category}
                </span>
              </div>
              
              {/* Text box */}
              <div className="p-[26px] space-y-[13px]">
                <div className="flex items-center gap-4 text-[11px] text-slate-400 font-body">
                  <div className="flex items-center gap-1.5">
                    <CiCalendar className="w-3.5 h-3.5" />
                    <span>{blogData[0].date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MdOutlineRemoveRedEye className="w-3.5 h-3.5" />
                    <span>{blogData[0].views} Views</span>
                  </div>
                </div>
                
                <h3 className="text-[18px] md:text-[21px] font-heading font-black text-[#1e293b] leading-tight group-hover:text-[#064e3b] transition-colors">
                  {blogData[0].title}
                </h3>
                
                <p className="text-[13px] text-slate-600 leading-[21px] font-body">
                  {blogData[0].description}
                </p>
              </div>
            </div>

            {/* Read more footer */}
            <div className="p-[26px] pt-0">
              <a 
                href={`/blog/${blogData[0].id}`}
                className="inline-flex items-center gap-1.5 text-[#064e3b] hover:text-[#043c2e] text-[13px] font-bold font-heading group/link"
              >
                <span>Read Full Analysis</span>
                <FiArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
              </a>
            </div>
          </article>

          {/* Right Column - Two Smaller Blog Posts (61.8% space on desktop) */}
          <div className="flex flex-col gap-[26px] justify-between">
            {blogData.slice(1).map((blog) => (
              <article 
                key={blog.id} 
                className="border border-slate-200/80 rounded-[21px] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row bg-slate-50/40 group flex-1"
              >
                {/* Image */}
                <div className="md:w-[38.2%] h-[200px] md:h-full relative overflow-hidden bg-slate-100 border-b md:border-b-0 md:border-r border-slate-200/80 flex-shrink-0">
                  <Image
                    alt={blog.title}
                    src={blog.image}
                    fill
                    sizes="(max-w-768px) 100vw, 25vw"
                    className="object-cover transition-transform duration-[1s] group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs text-[#064e3b] text-[10px] font-heading font-bold px-[10px] py-[4px] rounded-full shadow-xs">
                    {blog.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-[26px] flex flex-col justify-between flex-1 space-y-[13px]">
                  <div className="space-y-[8px]">
                    <div className="flex items-center gap-4 text-[11px] text-slate-400 font-body">
                      <div className="flex items-center gap-1.5">
                        <CiCalendar className="w-3.5 h-3.5" />
                        <span>{blog.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MdOutlineRemoveRedEye className="w-3.5 h-3.5" />
                        <span>{blog.views} Views</span>
                      </div>
                    </div>
                    
                    <h3 className="text-[17px] md:text-[19px] font-heading font-bold text-[#1e293b] leading-snug group-hover:text-[#064e3b] transition-colors">
                      {blog.title}
                    </h3>
                    
                    <p className="text-[13px] text-slate-600 leading-[21px] font-body line-clamp-2">
                      {blog.description}
                    </p>
                  </div>

                  <div>
                    <a 
                      href={`/blog/${blog.id}`}
                      className="inline-flex items-center gap-1.5 text-[#064e3b] hover:text-[#043c2e] text-[13px] font-bold font-heading group/link"
                    >
                      <span>Read Article</span>
                      <FiArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default BlogHome;
