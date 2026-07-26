"use client";

import React, { useState } from "react";
import Navbar from "@/components/public-facing/shared/Navbar";
import Footer from "@/components/public-facing/shared/Footer";
import SpotlightCard from "@/components/ui/SpotlightCard";
import ShinyText from "@/components/ui/ShinyText";
import Image from "next/image";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import { CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    agree: false
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.message || !formData.agree) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 w-full flex flex-col justify-between">
      
      {/* Navigation */}
      <Navbar />

      <main className="w-full pb-20">
        
        {/* Page Hero - Page Title section */}
        <section className="bg-white border-b border-slate-100 py-16 md:py-24">
          <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] space-y-6 text-center max-w-4xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/5 px-3 py-1.5 rounded-full font-heading">
              Support Desk
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-secondary leading-tight tracking-tight">
              Get in Touch with <br />
              <ShinyText text="InvestConnect Support" speed={4} />
            </h1>
            <p className="text-sm md:text-base text-muted-foreground font-body max-w-2xl mx-auto leading-relaxed">
              Have questions about our platform, subscriptions, or partnership opportunities? Reach out to us below.
            </p>
          </div>
        </section>

        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 xl:px-[100px] mt-12 space-y-12">
          
          {/* Four Cards Info Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Address */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 flex justify-between items-center group shadow-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold font-heading text-slate-400 uppercase tracking-wider">Address</span>
                <p className="text-xs font-bold text-slate-700 font-body">Gulshan Avenue, Dhaka</p>
              </div>
              <button className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-primary text-slate-700 group-hover:text-white flex items-center justify-center transition-all shrink-0 cursor-pointer">
                <FiArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 2: Email */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 flex justify-between items-center group shadow-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold font-heading text-slate-400 uppercase tracking-wider">You Can Email Here</span>
                <p className="text-xs font-bold text-slate-700 font-body">support@investconnect.com</p>
              </div>
              <button className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-primary text-slate-700 group-hover:text-white flex items-center justify-center transition-all shrink-0 cursor-pointer">
                <FiArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 3: Phone */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 flex justify-between items-center group shadow-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold font-heading text-slate-400 uppercase tracking-wider">Call us on</span>
                <p className="text-xs font-bold text-slate-700 font-body">+880 (2) 555-0199</p>
              </div>
              <button className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-primary text-slate-700 group-hover:text-white flex items-center justify-center transition-all shrink-0 cursor-pointer">
                <FiArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 4: Working Hours */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 flex justify-between items-center group shadow-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold font-heading text-slate-400 uppercase tracking-wider">Working Hours</span>
                <p className="text-xs font-bold text-slate-700 font-body">10:00 am - 6:00 pm</p>
              </div>
              <button className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-primary text-slate-700 group-hover:text-white flex items-center justify-center transition-all shrink-0 cursor-pointer">
                <FiArrowUpRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Main Section: Collaboration Graphic & Form Container */}
          <div className="bg-white border border-slate-200/60 rounded-[32px] p-6 md:p-8 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Left Column: Hand Shake Graphic & Collabs info */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-6">
                
                <div className="relative w-full h-[320px] md:h-[400px] rounded-[24px] overflow-hidden bg-slate-50 border border-slate-100">
                  <Image
                    src="/hands_connecting.png"
                    alt="InvestConnect Partnerships"
                    fill
                    sizes="(max-w-768px) 100vw, 40vw"
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Collabs contact card */}
                <div className="bg-slate-50 border border-slate-100 rounded-[20px] p-5 flex justify-between items-center group">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold font-heading text-slate-400 uppercase tracking-wider">Partnerships and Collaborations</span>
                    <p className="text-xs font-bold text-slate-800 font-body">collabs@investconnect.com</p>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-primary text-slate-700 group-hover:text-white flex items-center justify-center transition-all shrink-0 cursor-pointer">
                    <FiArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

              {/* Right Column: Contact Message Form */}
              <div className="lg:col-span-7 bg-slate-50/50 border border-slate-100 rounded-[24px] p-6 md:p-8 flex flex-col justify-center">
                
                {submitted ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                    <CheckCircle2 className="w-16 h-16 text-emerald-600 animate-bounce" />
                    <h3 className="text-lg font-heading font-black text-secondary">Message Sent Successfully!</h3>
                    <p className="text-xs text-slate-500 font-body max-w-sm">
                      Thank you for reaching out, {formData.firstName}. Our administrators have received your inquiry and will contact you via {formData.email} shortly.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ firstName: "", lastName: "", email: "", phone: "", message: "", agree: false });
                      }}
                      className="bg-primary hover:opacity-95 text-white px-6 py-2.5 rounded-xl text-xs font-bold font-heading transition-opacity cursor-pointer mt-4"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Row 1: Name Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold font-heading text-slate-500 uppercase tracking-wider">First Name</label>
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          placeholder="Enter First Name"
                          className="w-full bg-white border border-slate-200 focus:border-primary/50 rounded-xl px-4 py-2.5 text-xs text-secondary outline-hidden transition-all font-body shadow-2xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold font-heading text-slate-500 uppercase tracking-wider">Last Name</label>
                        <input
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          placeholder="Enter Last Name"
                          className="w-full bg-white border border-slate-200 focus:border-primary/50 rounded-xl px-4 py-2.5 text-xs text-secondary outline-hidden transition-all font-body shadow-2xs"
                        />
                      </div>
                    </div>

                    {/* Row 2: Contact Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold font-heading text-slate-500 uppercase tracking-wider">Email</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="Enter your Email"
                          className="w-full bg-white border border-slate-200 focus:border-primary/50 rounded-xl px-4 py-2.5 text-xs text-secondary outline-hidden transition-all font-body shadow-2xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold font-heading text-slate-500 uppercase tracking-wider">Phone</label>
                        <input
                          type="text"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="Enter Phone Number"
                          className="w-full bg-white border border-slate-200 focus:border-primary/50 rounded-xl px-4 py-2.5 text-xs text-secondary outline-hidden transition-all font-body shadow-2xs"
                        />
                      </div>
                    </div>

                    {/* Row 3: Message Field */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold font-heading text-slate-500 uppercase tracking-wider">Message</label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Enter your Message"
                        className="w-full bg-white border border-slate-200 focus:border-primary/50 rounded-xl px-4 py-2.5 text-xs text-secondary outline-hidden transition-all font-body resize-none shadow-2xs"
                      />
                    </div>

                    {/* Row 4: Agreement Checkbox & Button */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          required
                          checked={formData.agree}
                          onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                          className="w-4 h-4 rounded-sm border-slate-300 text-primary focus:ring-primary cursor-pointer"
                        />
                        <span className="text-[11px] text-slate-500 font-body">
                          I agree with Terms of Use and Privacy Policy
                        </span>
                      </label>

                      <button
                        type="submit"
                        className="bg-primary hover:bg-[#043c2e] text-white px-6 py-3 rounded-full text-xs font-bold font-heading transition-colors cursor-pointer shrink-0"
                      >
                        Send your Message
                      </button>
                    </div>

                  </form>
                )}

              </div>

            </div>
          </div>

          {/* We Would Love to Hear from You Card - Moved below the Form Container */}
          <div className="bg-white border border-slate-200/60 rounded-[32px] p-8 md:p-12 relative overflow-hidden shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Title Column */}
              <div className="lg:col-span-6 space-y-4">
                <h2 className="text-3xl md:text-4xl font-heading font-black text-secondary leading-tight">
                  We Would Love to <br />
                  <span className="bg-[#10b981]/15 px-3 py-1 rounded-2xl text-[#064e3b] inline-block mt-2 font-heading font-black">
                    Hear from You
                  </span>
                </h2>
              </div>

              {/* Description & Socials Column */}
              <div className="lg:col-span-6 space-y-6">
                <p className="text-xs md:text-sm text-slate-500 font-body leading-relaxed">
                  Thank you for your interest in InvestConnect and our mission to match seed capital with vetted entrepreneur initiatives. We value your thoughts, questions, and feedback. Please don't hesitate to reach out to us. Our dedicated team is here to assist you.
                </p>
                
                {/* Social Circles */}
                <div className="flex gap-3">
                  <a href="#" className="w-10 h-10 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#064e3b] flex items-center justify-center transition-colors cursor-pointer">
                    <FaFacebookF className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#064e3b] flex items-center justify-center transition-colors cursor-pointer">
                    <FaTwitter className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#064e3b] flex items-center justify-center transition-colors cursor-pointer">
                    <FaLinkedinIn className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Two guidelines links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Box 1: Entrepreneur Guidelines (Primary Green Button style) */}
            <div className="bg-white border border-slate-200/60 rounded-[32px] p-8 space-y-4 flex flex-col justify-between group shadow-xs">
              <div className="space-y-2">
                <h3 className="text-lg font-heading font-black text-secondary">Startup Pitch Guidelines</h3>
                <p className="text-xs text-slate-500 font-body leading-relaxed">
                  Interested in submitting your startup business pitch? Please view our guideline documentation and file requirements before submitting your showcase proposal.
                </p>
              </div>
              <div className="pt-4 flex justify-start">
                <button className="bg-primary hover:bg-[#043c2e] text-white text-xs font-bold px-5 py-2.5 rounded-full transition-colors font-heading flex items-center gap-2 group-hover:scale-102 cursor-pointer shadow-xs">
                  <span>Pitch Guidelines</span>
                  <FiArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Box 2: Consultant Guides (Secondary Gray Button style) */}
            <div className="bg-white border border-slate-200/60 rounded-[32px] p-8 space-y-4 flex flex-col justify-between group shadow-xs">
              <div className="space-y-2">
                <h3 className="text-lg font-heading font-black text-secondary">Consultant Cohorts & Apply</h3>
                <p className="text-xs text-slate-500 font-body leading-relaxed">
                  Want to host a mentorship cohort or upload recorded training courses? Check out the terms, verification guidelines, and revenue split schedules.
                </p>
              </div>
              <div className="pt-4 flex justify-start">
                <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-5 py-2.5 rounded-full transition-colors font-heading flex items-center gap-2 group-hover:scale-102 cursor-pointer border border-slate-200/50">
                  <span>Mentorship Rates</span>
                  <FiArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
