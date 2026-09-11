"use client";

import React from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Star, MapPin, User, HardDriveDownload } from "lucide-react";
import type { SavedAddress } from "@/lib/types";
import { useProfile, useHydrated } from "@/lib/store";
import { COUNTRIES, ADDRESS_LABELS } from "@/lib/countries";
import { cn } from "@/lib/utils";
import { PFButton } from "@/components/pf/button";
import { ConditionBadge } from "@/components/pf/badges";

const inputClass =
  "h-11 w-full border-2 border-pf-black bg-pf-paper px-3 text-sm text-pf-black outline-none transition-colors placeholder:text-pf-muted/60 focus:bg-white";

function emptyAddress(): SavedAddress {
  return {
    id: `addr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    label: "Home",
    country: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    isDefault: false,
  };
}

export function ProfileView() {
  const hydrated = useHydrated();
  const profile = useProfile((s) => s.profile);
  const setPersonal = useProfile((s) => s.setPersonal);
  const addAddress = useProfile((s) => s.addAddress);
  const updateAddress = useProfile((s) => s.updateAddress);
  const removeAddress = useProfile((s) => s.removeAddress);
  const setDefaultAddress = useProfile((s) => s.setDefaultAddress);
  const clearAll = useProfile((s) => s.clearAll);

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [editing, setEditing] = React.useState<SavedAddress | null>(null);
  const [savedToast, setSavedToast] = React.useState(false);

  // Load profile into local form state once hydrated
  React.useEffect(() => {
    if (hydrated) {
      setName(profile.name);
      setEmail(profile.email);
      setPhone(profile.phone);
    }
  }, [hydrated, profile.name, profile.email, profile.phone]);

  function savePersonal() {
    setPersonal({ name: name.trim(), email: email.trim(), phone: phone.trim() });
    setSavedToast(true);
    window.setTimeout(() => setSavedToast(false), 2000);
    toast.success("PROFILE SAVED", { description: "Stored locally on this device only." });
  }

  function saveAddress() {
    if (!editing) return;
    if (!editing.country || !editing.line1.trim() || !editing.city.trim() || !editing.postalCode.trim()) {
      toast.error("INCOMPLETE ADDRESS", { description: "Country, line 1, city and postal code are required." });
      return;
    }
    if (profile.addresses.some((a) => a.id === editing.id)) {
      updateAddress(editing);
      toast.success("ADDRESS UPDATED", { description: `${editing.label} — ${editing.city}` });
    } else {
      addAddress(editing);
      toast.success("ADDRESS SAVED", { description: `${editing.label} — ${editing.city}` });
    }
    setEditing(null);
  }

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-[1100px] px-4 py-16 sm:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-72 bg-pf-sand" />
          <div className="h-64 border-2 border-pf-black/10 bg-pf-sand" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-pf-black pb-4">
        <div>
          <p className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.3em] text-pf-purple">
            LOCAL PROFILE — NO ACCOUNT, NO SERVER
          </p>
          <h1 className="font-display text-4xl uppercase leading-none text-pf-black sm:text-5xl">
            Profile
          </h1>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3 border-2 border-pf-black bg-pf-purple-soft/50 p-4">
        <HardDriveDownload className="mt-0.5 h-5 w-5 shrink-0 text-pf-purple" strokeWidth={2} />
        <p className="text-xs leading-relaxed text-pf-ink">
          Everything here lives in <strong>this browser&apos;s local storage</strong> — it never leaves your
          device and is used only to prefill checkout. Clearing your browser data removes it. There is no
          POSTFORM account system and no server-side customer database.
        </p>
      </div>

      {/* PERSONAL INFO */}
      <section className="mt-8 border-2 border-pf-black bg-pf-paper" aria-labelledby="personal-heading">
        <div className="flex items-center gap-2 border-b-2 border-pf-black px-5 py-3">
          <User className="h-4 w-4 text-pf-purple" strokeWidth={2.5} />
          <h2 id="personal-heading" className="font-mono-tech text-xs font-bold uppercase tracking-[0.25em]">
            Personal Information
          </h2>
        </div>
        <div className="grid gap-4 px-5 py-5 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1 block font-mono-tech text-[10px] font-bold uppercase tracking-[0.2em]">NAME</span>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="JANE DOE" autoComplete="name" />
          </label>
          <label className="block">
            <span className="mb-1 block font-mono-tech text-[10px] font-bold uppercase tracking-[0.2em]">EMAIL</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="YOU@EXAMPLE.COM" autoComplete="email" />
          </label>
          <label className="block">
            <span className="mb-1 block font-mono-tech text-[10px] font-bold uppercase tracking-[0.2em]">PHONE</span>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="+44 7700 900000" autoComplete="tel" />
          </label>
        </div>
        <div className="flex items-center justify-between border-t border-pf-black/15 px-5 py-3">
          {savedToast ? (
            <span className="font-mono-tech text-[10px] font-bold uppercase tracking-widest text-pf-purple">
              ✓ SAVED TO THIS DEVICE
            </span>
          ) : (
            <span className="font-mono-tech text-[10px] uppercase tracking-widest text-pf-muted">
              USED TO PREFILL CHECKOUT
            </span>
          )}
          <PFButton size="sm" onClick={savePersonal}>
            Save profile
          </PFButton>
        </div>
      </section>

      {/* ADDRESSES */}
      <section className="mt-8 border-2 border-pf-black bg-pf-paper" aria-labelledby="addr-heading">
        <div className="flex items-center justify-between border-b-2 border-pf-black px-5 py-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-pf-purple" strokeWidth={2.5} />
            <h2 id="addr-heading" className="font-mono-tech text-xs font-bold uppercase tracking-[0.25em]">
              Saved Addresses
            </h2>
          </div>
          <PFButton size="sm" variant="primary" onClick={() => setEditing(emptyAddress())}>
            <Plus className="h-4 w-4" strokeWidth={2.5} /> Add address
          </PFButton>
        </div>

        <div className="px-5 py-5">
          {editing ? (
            <div className="border-2 border-pf-black bg-pf-cream p-4">
              <p className="mb-4 font-mono-tech text-[10px] font-bold uppercase tracking-[0.25em] text-pf-purple">
                {profile.addresses.some((a) => a.id === editing.id) ? "EDIT ADDRESS" : "NEW ADDRESS"}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block font-mono-tech text-[10px] font-bold uppercase tracking-[0.2em]">LABEL</span>
                  <div className="flex gap-2">
                    {ADDRESS_LABELS.map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setEditing({ ...editing, label: l })}
                        aria-pressed={editing.label === l}
                        className={cn(
                          "flex-1 border-2 border-pf-black px-2 py-2 font-mono-tech text-[11px] font-bold uppercase transition-colors",
                          editing.label === l ? "bg-pf-black text-pf-yellow" : "bg-pf-paper hover:bg-pf-yellow"
                        )}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </label>
                <label className="block">
                  <span className="mb-1 block font-mono-tech text-[10px] font-bold uppercase tracking-[0.2em]">COUNTRY *</span>
                  <select
                    value={editing.country}
                    onChange={(e) => setEditing({ ...editing, country: e.target.value })}
                    className={cn(inputClass, "cursor-pointer")}
                  >
                    <option value="">— SELECT —</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1 block font-mono-tech text-[10px] font-bold uppercase tracking-[0.2em]">ADDRESS LINE 1 *</span>
                  <input type="text" value={editing.line1} onChange={(e) => setEditing({ ...editing, line1: e.target.value })} className={inputClass} placeholder="STREET AND NUMBER" />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1 block font-mono-tech text-[10px] font-bold uppercase tracking-[0.2em]">ADDRESS LINE 2</span>
                  <input type="text" value={editing.line2 ?? ""} onChange={(e) => setEditing({ ...editing, line2: e.target.value || null })} className={inputClass} placeholder="APARTMENT, SUITE…" />
                </label>
                <label className="block">
                  <span className="mb-1 block font-mono-tech text-[10px] font-bold uppercase tracking-[0.2em]">CITY *</span>
                  <input type="text" value={editing.city} onChange={(e) => setEditing({ ...editing, city: e.target.value })} className={inputClass} />
                </label>
                <label className="block">
                  <span className="mb-1 block font-mono-tech text-[10px] font-bold uppercase tracking-[0.2em]">STATE / REGION</span>
                  <input type="text" value={editing.state ?? ""} onChange={(e) => setEditing({ ...editing, state: e.target.value || null })} className={inputClass} />
                </label>
                <label className="block">
                  <span className="mb-1 block font-mono-tech text-[10px] font-bold uppercase tracking-[0.2em]">POSTAL / ZIP *</span>
                  <input type="text" value={editing.postalCode} onChange={(e) => setEditing({ ...editing, postalCode: e.target.value })} className={inputClass} />
                </label>
                <label className="flex items-center gap-2 self-end pb-2 text-xs text-pf-ink">
                  <input
                    type="checkbox"
                    checked={editing.isDefault}
                    onChange={(e) => setEditing({ ...editing, isDefault: e.target.checked })}
                    className="h-4 w-4 accent-[#6c4cf1]"
                  />
                  Set as default address
                </label>
              </div>
              <div className="mt-4 flex gap-3">
                <PFButton onClick={saveAddress}>Save address</PFButton>
                <PFButton variant="outline" onClick={() => setEditing(null)}>
                  Cancel
                </PFButton>
              </div>
            </div>
          ) : profile.addresses.length === 0 ? (
            <p className="border-2 border-dashed border-pf-black/25 px-4 py-10 text-center font-mono-tech text-xs uppercase tracking-widest text-pf-muted">
              NO SAVED ADDRESSES — ADD ONE TO SPEED UP CHECKOUT
            </p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {profile.addresses.map((a) => (
                <li key={a.id} className={cn("flex flex-col border-2 border-pf-black bg-pf-cream", a.isDefault && "bg-pf-yellow-soft/40")}>
                  <div className="flex items-center justify-between border-b-2 border-pf-black px-4 py-2.5">
                    <span className="flex items-center gap-2 font-mono-tech text-[11px] font-bold uppercase tracking-widest">
                      {a.label}
                      {a.isDefault && (
                        <span className="flex items-center gap-1 border border-pf-black bg-pf-yellow px-1.5 py-0.5 text-[9px]">
                          <Star className="h-2.5 w-2.5" fill="currentColor" /> DEFAULT
                        </span>
                      )}
                    </span>
                    <span className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setEditing({ ...a })}
                        aria-label={`Edit ${a.label} address`}
                        className="flex h-8 w-8 items-center justify-center border border-pf-black bg-pf-paper transition-colors hover:bg-pf-sand"
                      >
                        <Pencil className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          removeAddress(a.id);
                          toast.success("ADDRESS DELETED");
                        }}
                        aria-label={`Delete ${a.label} address`}
                        className="flex h-8 w-8 items-center justify-center border border-pf-black bg-pf-paper transition-colors hover:bg-pf-red hover:text-white"
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </button>
                    </span>
                  </div>
                  <div className="flex-1 px-4 py-3 text-sm leading-relaxed text-pf-ink">
                    <p className="font-bold text-pf-black">{a.line1}</p>
                    {a.line2 && <p>{a.line2}</p>}
                    <p>
                      {a.city}
                      {a.state ? `, ${a.state}` : ""} {a.postalCode}
                    </p>
                    <p className="font-mono-tech text-[11px] uppercase tracking-wider text-pf-muted">{a.country}</p>
                  </div>
                  {!a.isDefault && (
                    <button
                      type="button"
                      onClick={() => {
                        setDefaultAddress(a.id);
                        toast.success("DEFAULT ADDRESS SET", { description: `${a.label} — ${a.city}` });
                      }}
                      className="border-t-2 border-pf-black px-4 py-2 text-left font-mono-tech text-[10px] font-bold uppercase tracking-widest text-pf-purple transition-colors hover:bg-pf-yellow"
                    >
                      SET AS DEFAULT
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* DANGER ZONE */}
      <section className="mt-8 border-2 border-pf-red/60 bg-pf-paper" aria-labelledby="danger-heading">
        <div className="border-b-2 border-pf-red/60 px-5 py-3">
          <h2 id="danger-heading" className="font-mono-tech text-xs font-bold uppercase tracking-[0.25em] text-pf-red">
            Clear Local Data
          </h2>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <p className="max-w-md text-xs leading-relaxed text-pf-muted">
            Removes the profile and all saved addresses stored in this browser. Cart and wishlist are not
            affected.
          </p>
          <PFButton
            variant="danger"
            onClick={() => {
              clearAll();
              setName("");
              setEmail("");
              setPhone("");
              toast.success("LOCAL PROFILE CLEARED");
            }}
          >
            <Trash2 className="h-4 w-4" /> Clear profile data
          </PFButton>
        </div>
      </section>

      {/* Demo note */}
      <div className="mt-6 flex items-center gap-3 border-2 border-dashed border-pf-black/20 p-3">
        <ConditionBadge condition="LOCAL ONLY" />
        <p className="text-[11px] text-pf-muted">
          POSTFORM stores profiles in browser localStorage — device-specific by design. Order history is
          intentionally not kept.
        </p>
      </div>
    </div>
  );
}
