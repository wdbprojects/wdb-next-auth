"use client";

import { Button } from "@/components/ui/button";

const Social = () => {
  return (
    <div className="flex items-center w-full gap-x-2">
      <Button size="sm" className="w-full" variant="outline" onClick={() => {}}>
        Github
      </Button>
      <Button size="sm" className="w-full" variant="outline" onClick={() => {}}>
        Google
      </Button>
    </div>
  );
};
export default Social;
