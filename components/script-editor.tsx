"use client";

import { Button } from "@/components/ui/button";
import { PlayCircle, Download, X, Zap } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

export function ScriptEditor() {
  const [speed, setSpeed] = useState(1.0);

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-[900px] mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Marketing Script</h1>
            <p className="text-sm text-muted-foreground">512 characters</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary">Generate All</Button>
            <Button variant="secondary">Export</Button>
          </div>
        </div>

        <div className="space-y-6">
          <ScriptBlock
            voice="Giss"
            text="Are you looking for a digital marketing expert...?"
          />
          <ScriptBlock
            voice="Giss"
            text="Discover social media marketing solutions that will help you grow your online presence!"
          />
          <div className="relative">
            <ScriptBlock
              voice="Giss"
              text="My name is Jiz Mojeha and I represent a team dedicated to deliver concrete results that meets your brand's goals."
              showVoiceOptions
            />
            <div className="absolute top-0 -right-[400px] w-[380px]">
              <VoiceOptions />
            </div>
          </div>
          <ScriptBlock
            voice="Giss"
            text={`We are committed to:\n- optimizing your social media accounts\n- creating high quality content\n- increasing brand visibility and awareness\nand an endless pool of design services!`}
          />
          <ScriptBlock
            voice="Giss"
            text="Contact me now! and discover what we can do for your business!"
          />
        </div>
      </div>
    </div>
  );
}

function ScriptBlock({ voice, text, showVoiceOptions = false }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <div className="flex items-center gap-2 min-w-[80px]">
          <span className="text-emerald-500">◑</span>
          {voice}
        </div>
        <div className="flex-1">
          <div className="bg-secondary/50 rounded-lg p-4">
            <div className="flex items-start gap-4">
              <Button size="icon" variant="ghost" className="mt-1">
                <PlayCircle className="h-5 w-5" />
              </Button>
              <p className="flex-1 whitespace-pre-line">{text}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VoiceOptions() {
  return (
    <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Pick your preferred version</h3>
        <Button variant="secondary" className="bg-purple-600 hover:bg-purple-700">
          Regenerate
        </Button>
      </div>

      <div className="space-y-4">
        <VoiceOption label="My name is Jiz Mojeha and (4)" selected />
        <VoiceOption label="My name is Jiz Mojeha and (1)" />
      </div>

      <Button className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600">
        <Zap className="w-4 h-4 mr-2" />
        Get Faster Generations
      </Button>

      <p className="text-sm text-muted-foreground mt-4">
        <Zap className="w-4 h-4 inline mr-1" />
        For faster generations, upgrade your plan.
      </p>
      <p className="text-sm text-muted-foreground mt-2">
        Each sample is unique. Click on "Regenerate" to create multiple samples and select the one you prefer.
      </p>
    </div>
  );
}

function VoiceOption({ label, selected = false }) {
  return (
    <div className="flex items-center gap-4">
      <input
        type="radio"
        className="w-4 h-4"
        checked={selected}
        onChange={() => {}}
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Button size="icon" variant="ghost">
            <PlayCircle className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <Slider defaultValue={[70]} max={100} step={1} />
          </div>
          <Button size="icon" variant="ghost">
            <Download className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}