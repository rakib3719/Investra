"use client";

import { useState } from "react";
import {
  FolderTree,
  Hash,
  Layers,
  Plus,
  Rocket,
  Search,
  Tag,
  X,
} from "lucide-react";
import {
  MetricCard,
  Panel,
  SectionHeading,
} from "@/components/dashboard/investor/InvestorUI";
import { useCategoriesQuery } from "@/lib/campaigns/campaigns-hooks";
import { InvestraLoader } from "@/components/ui/InvestraLoader";

export function AdminCategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const categoriesQuery = useCategoriesQuery();

  const categories = categoriesQuery.data || [];

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const totalCampaignsInCategories = categories.reduce(
    (sum, c) => sum + (c._count?.businesses || 0),
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Panel className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Marketplace Taxonomies & Categories
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Manage investment industry verticals, venture sectors, and search taxonomies
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">
              Total Categories: {categories.length}
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="mt-5 relative max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search categories by name or slug…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </Panel>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          label="Active Categories"
          value={categories.length.toString()}
          detail="Industry verticals active in marketplace"
          icon={FolderTree}
        />
        <MetricCard
          label="Assigned Campaigns"
          value={totalCampaignsInCategories.toString()}
          detail="Campaigns categorized in database"
          icon={Rocket}
        />
        <MetricCard
          label="Average Deals / Sector"
          value={
            categories.length
              ? (totalCampaignsInCategories / categories.length).toFixed(1)
              : "0"
          }
          detail="Market vertical density"
          icon={Layers}
        />
      </div>

      {/* Category Grid */}
      <Panel className="p-6">
        <SectionHeading
          title="Sector Directory"
          description="Click any sector to inspect its mapped venture opportunities"
        />

        {categoriesQuery.isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <InvestraLoader label="Loading marketplace categories…" />
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-12 text-center">
            <FolderTree className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-800">No categories found</p>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search query.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                className="rounded-xl border border-slate-200/80 p-5 hover:border-emerald-300 hover:shadow-md transition bg-white space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                      <Tag className="h-4 w-4" />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {cat.name}
                      </h4>
                      <p className="text-[11px] font-mono text-slate-400">
                        /{cat.slug}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                    {cat._count?.businesses || 0} deals
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {cat.description || "No sector description provided."}
                </p>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
