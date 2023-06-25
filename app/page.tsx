"use client";
import { Loader2 } from "lucide-react";

import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";

const defaultValues = {
  level: 238,
  class: "Dawn Warrior",
  mainWeapon: "2H Sword",
  upperRangeValue: 2000000,
  bossDamage: 150,
  ied: 85,
  damageBonus: 64,
  finalDamage: 60,
  criticalRate: 70,
  criticalDamage: 22,
  str: 12438,
  dex: 2300,
  int: 1500,
  luk: 1700,
};

const localStorageKey = "characterStats";

export default function Home() {
  const { register, handleSubmit, watch, setValue, formState } = useForm({
    defaultValues,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  const onSubmit = async (data: typeof defaultValues) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/advice`,
        data
      );
      setAiResponse(response.data.message.content);
    } catch (error) {
      console.error("Error:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const storedValues = localStorage.getItem(localStorageKey);
    if (storedValues) {
      const parsedValues = JSON.parse(storedValues);
      for (const [key, value] of Object.entries(parsedValues)) {
        setValue(
          key as keyof typeof defaultValues,
          value as keyof typeof defaultValues
        );
      }
    }
  }, [setValue]);

  useEffect(() => {
    if (formState.isDirty) {
      const values = watch();
      localStorage.setItem(localStorageKey, JSON.stringify(values));
    }
  }, [watch, formState]);

  return (
    <div className="flex flex-col items-center min-h-screen">
      <nav className="flex justify-end p-4 w-full">
        <ModeToggle />
      </nav>
      <main className="flex flex-col items-center p-4 max-w-5xl">
        <h1 className="text-4xl font-bold text-center mb-8">
          MapleStory Reboot AI Assistant
        </h1>
        <form>
          <h2 className="text-xl text-center mb-12">
            Provide your Reboot character&apos;s stats. Get AI progression
            advice.
          </h2>
          <div className="flex flex-wrap gap-4 mb-12">
            <div>
              <Label htmlFor="level">Level</Label>
              <Input
                id="level"
                {...register("level")}
                placeholder="Level"
                type="number"
              />
            </div>

            <div>
              <Label htmlFor="class">Class</Label>
              <Input
                id="class"
                {...register("class")}
                placeholder="Class"
                type="text"
              />
            </div>

            <div>
              <Label htmlFor="mainWeapon">Main Weapon</Label>
              <Input
                id="mainWeapon"
                {...register("mainWeapon")}
                placeholder="Main Weapon"
                type="text"
              />
            </div>

            <div>
              <Label htmlFor="upperRangeValue">Upper Range Value</Label>
              <Input
                id="upperRangeValue"
                {...register("upperRangeValue")}
                placeholder="Upper Range Value"
                type="number"
              />
            </div>

            <div>
              <Label htmlFor="bossDamage">Boss Damage</Label>
              <Input
                id="bossDamage"
                {...register("bossDamage")}
                placeholder="Boss Damage"
                type="number"
              />
            </div>

            <div>
              <Label htmlFor="ied">IED</Label>
              <Input
                id="ied"
                {...register("ied")}
                placeholder="IED"
                type="number"
              />
            </div>

            <div>
              <Label htmlFor="damageBonus">Damage Bonus</Label>
              <Input
                id="damageBonus"
                {...register("damageBonus")}
                placeholder="Damage Bonus"
                type="number"
              />
            </div>

            <div>
              <Label htmlFor="finalDamage">Final Damage</Label>
              <Input
                id="finalDamage"
                {...register("finalDamage")}
                placeholder="Final Damage"
                type="number"
              />
            </div>

            <div>
              <Label htmlFor="criticalRate">Critical Rate</Label>
              <Input
                id="criticalRate"
                {...register("criticalRate")}
                placeholder="Critical Rate"
                type="number"
              />
            </div>

            <div>
              <Label htmlFor="criticalDamage">Critical Damage</Label>
              <Input
                id="criticalDamage"
                {...register("criticalDamage")}
                placeholder="Critical Damage"
                type="number"
              />
            </div>

            <div>
              <Label htmlFor="str">STR</Label>
              <Input
                id="str"
                {...register("str")}
                placeholder="STR"
                type="number"
              />
            </div>

            <div>
              <Label htmlFor="dex">DEX</Label>
              <Input
                id="dex"
                {...register("dex")}
                placeholder="DEX"
                type="number"
              />
            </div>

            <div>
              <Label htmlFor="int">INT</Label>
              <Input
                id="int"
                {...register("int")}
                placeholder="INT"
                type="number"
              />
            </div>

            <div>
              <Label htmlFor="luk">LUK</Label>
              <Input
                id="luk"
                {...register("luk")}
                placeholder="LUK"
                type="number"
              />
            </div>
          </div>
          <div className="flex gap-4 items-center justify-center mb-8">
            <Button onClick={handleSubmit(onSubmit)} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating advice...
                </>
              ) : (
                <>Get advice</>
              )}
            </Button>
          </div>
        </form>
        <p className="whitespace-pre-line mb-10 leading-loose">{aiResponse}</p>
      </main>
    </div>
  );
}
