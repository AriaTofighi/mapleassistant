"use client";
import { Loader2 } from "lucide-react";

import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const defaultValues = {
  level: 238,
  class: "Dawn Warrior",
  mainWeapon: "Two-handed Sword",
  upperRangeValue: 2000000,
  bossDamage: 150,
  ied: 85,
  damageBonus: 64,
  finalDamage: 60,
  criticalRate: 70,
  criticalDamage: 22,
  attackPower: 1103,
  str: 12438,
  dex: 2300,
  int: 1500,
  luk: 1700,
};

const MAPLESTORY_CLASSES = [
  "Adele",
  "Angelic Buster",
  "Aran",
  "Ark",
  "Battle Mage",
  "Bishop",
  "Blaster",
  "Blaze Wizard",
  "Beast Tamer",
  "Bowmaster",
  "Buccaneer",
  "Cadena",
  "Cannoneer",
  "Corsair",
  "Dark Knight",
  "Dawn Warrior",
  "Demon Avenger",
  "Demon Slayer",
  "Dual Blade",
  "Evan",
  "Fire Poison",
  "Hayato",
  "Hero",
  "Hoyoung",
  "Ice Lightning",
  "Illium",
  "Jett",
  "Kain",
  "Kaiser",
  "Kanna",
  "Kinesis",
  "Lara",
  "Luminous",
  "Marksmen",
  "Mechanic",
  "Mercedes",
  "Mihile",
  "Night Lord",
  "Night Walker",
  "Paladin",
  "Pathfinder",
  "Phantom",
  "Shade",
  "Shadower",
  "Thunder Breaker",
  "Wild Hunter",
  "Wind Archer",
  "Xenon",
  "Zero",
];

const MAIN_WEAPONS = [
  "Ancient Bow",
  "Arm Cannon",
  "Bladecaster",
  "Bow",
  "Cane",
  "Cannon",
  "Chain",
  "Claw",
  "Crossbow",
  "Dagger",
  "Desperado",
  "Dual Bowgun",
  "Fan",
  "Gun",
  "Heavy Sword",
  "Katana",
  "Knuckle",
  "Lucent Guantlet",
  "One-handed Axe",
  "One-handed Mace",
  "One-handed Sword",
  "Polearm",
  "Psy-limiter",
  "Ritual Fan",
  "Scepter",
  "Shining Rod",
  "Soul Shooter",
  "Spear",
  "Staff",
  "Two-handed Axe",
  "Two-handed Mace",
  "Two-handed Sword",
  "Wand",
  "Whip Blade",
  "Whispershot",
];

const localStorageKey = "characterStats";

const REQUEST_STATUSES = {
  IDLE: "IDLE",
  LOADING: "LOADING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
} as const;

type RequestStatus = keyof typeof REQUEST_STATUSES;

export default function Home() {
  const { register, handleSubmit, watch, setValue, formState } = useForm({
    defaultValues,
  });
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(
    REQUEST_STATUSES.IDLE
  );
  const [aiResponse, setAiResponse] = useState("");

  const onSubmit = async (data: typeof defaultValues) => {
    setRequestStatus(REQUEST_STATUSES.LOADING);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/advice`,
        data
      );
      setAiResponse(response.data.message.content);
      setRequestStatus(REQUEST_STATUSES.SUCCESS);
    } catch (error) {
      setRequestStatus(REQUEST_STATUSES.ERROR);
      console.error("Error:", error);
    }
  };

  const getButtonContent = () => {
    switch (requestStatus) {
      case REQUEST_STATUSES.IDLE:
        return "Get advice";
      case REQUEST_STATUSES.LOADING:
        return (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating advice...
          </>
        );
      case REQUEST_STATUSES.ERROR:
        return "Error generating advice. Try again?";
      case REQUEST_STATUSES.SUCCESS:
        return "Try for more advice";
    }
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
    const values = watch();
    localStorage.setItem(localStorageKey, JSON.stringify(values));
  }, [watch, formState]);

  return (
    <div className="flex flex-col items-center min-h-screen">
      <nav className="flex justify-end p-4 w-full">
        <ModeToggle />
      </nav>
      <main className="flex flex-col items-center p-4 max-w-5xl">
        <h1 className="text-5xl font-bold text-center mb-8">
          MapleStory Progression Assistant
        </h1>
        <h2 className="text-xl text-center mb-5">
          Enter your Reboot character&apos;s stats. Get AI generated progression
          advice.
        </h2>
        <i className="text-sm text-center mb-10">
          Made by{" "}
          <a
            href="https://github.com/AriaTofighi"
            className="text-blue-300 hover:underline"
          >
            Aria Tofighi
          </a>
        </i>

        <form>
          <div className="flex flex-wrap gap-4 mb-10 justify-center [&>*]:w-44">
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
              <Select
                onValueChange={(value) => {
                  setValue("class", value);
                }}
                value={watch("class")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent className="max-h-96">
                  <SelectGroup>
                    <SelectLabel>Classes</SelectLabel>
                    {MAPLESTORY_CLASSES.map((fruit) => (
                      <SelectItem key={fruit} value={fruit}>
                        {fruit}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="mainWeapon">Main Weapon</Label>
              <Select
                onValueChange={(value) => {
                  setValue("mainWeapon", value);
                }}
                value={watch("mainWeapon")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a main weapon" />
                </SelectTrigger>
                <SelectContent className="max-h-96">
                  <SelectGroup>
                    <SelectLabel>Main Weapons</SelectLabel>
                    {MAIN_WEAPONS.map((weapon) => (
                      <SelectItem key={weapon} value={weapon}>
                        {weapon}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
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
              <Label htmlFor="bossDamage">Boss Damage %</Label>
              <Input
                id="bossDamage"
                {...register("bossDamage")}
                placeholder="Boss Damage %"
                type="number"
              />
            </div>

            <div>
              <Label htmlFor="ied">IED %</Label>
              <Input
                id="ied"
                {...register("ied")}
                placeholder="IED %"
                type="number"
              />
            </div>

            <div>
              <Label htmlFor="damageBonus">Damage Bonus %</Label>
              <Input
                id="damageBonus"
                {...register("damageBonus")}
                placeholder="Damage Bonus %"
                type="number"
              />
            </div>

            <div>
              <Label htmlFor="finalDamage">Final Damage %</Label>
              <Input
                id="finalDamage"
                {...register("finalDamage")}
                placeholder="Final Damage %"
                type="number"
              />
            </div>

            <div>
              <Label htmlFor="criticalRate">Critical Rate %</Label>
              <Input
                id="criticalRate"
                {...register("criticalRate")}
                placeholder="Critical Rate %"
                type="number"
              />
            </div>

            <div>
              <Label htmlFor="criticalDamage">Critical Damage %</Label>
              <Input
                id="criticalDamage"
                {...register("criticalDamage")}
                placeholder="Critical Damage %"
                type="number"
              />
            </div>

            <div>
              <Label htmlFor="str">Attack Power</Label>
              <Input
                id="attackPower"
                {...register("attackPower")}
                placeholder="Attack Power"
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
          <div className="flex flex-col gap-4 items-center justify-center mb-14">
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={requestStatus === REQUEST_STATUSES.LOADING}
              className="mb-4"
            >
              {getButtonContent()}
            </Button>
            <i className="text-sm text-center">
              Note: Advice generated by this AI tool is not guaranteed to always
              be accurate.
            </i>
          </div>
        </form>
        {aiResponse && (
          <div className="mx-10">
            <h2 className="mb-8 font-bold text-4xl">Progression Advice</h2>
            <p className="whitespace-pre-line text-lg mb-10 leading-loose">
              {aiResponse}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
