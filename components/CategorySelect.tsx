"use client";

import React from "react";

interface CategorySelectProps {
  categories: { category: string; _count: { category: number } }[];
  currentCategory?: string;
}

export default function CategorySelect({
  categories,
  currentCategory,
}: CategorySelectProps) {
  return (
    <select
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={currentCategory || ""}
      onChange={(e) => {
        const newCategory = e.target.value;
        const url = newCategory ? `/blog?category=${newCategory}` : "/blog";
        window.location.href = url;
      }}
    >
      <option value="">All Categories</option>
      {categories.map((cat) => (
        <option key={cat.category} value={cat.category}>
          {cat.category.replace("-", " ")} ({cat._count.category})
        </option>
      ))}
    </select>
  );
}