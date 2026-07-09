import { useState } from "react";

import { UsersTable } from "@/components/UsersTable";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/Header";

export default function Users() {
  const [search, setSearch] = useState("");

  return (
    <div>
      <Header title="Users" />
      <div className="p-4">
        <div className="flex justify-between mb-4">
          <Input
            placeholder="Search..."
            className="max-w-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <UsersTable search={search} />
      </div>
    </div>
  );
}
