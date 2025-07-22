"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import React from "react";

const DesignDemo = () => {
  return (
    <div className="flex gap-2 items-center justify-center">
      <Input placeholder="sk-9*************************"className="max-w-1/2"/>
      <Button>Submit</Button>
      <Switch />
    </div>
  );
};

export default DesignDemo;
