'use client'

import { useState } from 'react'
import { Check, ChevronDown, Globe, Search } from 'lucide-react'
import { COUNTRIES, getCountryIsoFromFlagUrl } from '@repo/constants'
import { useCountrySelector } from '@repo/hooks'
import type { Country } from '@repo/types'
import { cn } from '../../lib/cn'
import { ScrollArea } from './scroll-area'
import { TextInputField } from './TextInputField'

interface CountryCodeSelectorProps {
  value: string
  onChange: (code: string, countryIso?: string) => void
  preferredCountryIso?: string | null
  loginType?: 'mobile' | 'email'
  disabled?: boolean
  className?: string
}

function CountryFlag({ country }: { country: Country }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <span
        className="flex app-icon-md shrink-0 items-center justify-center rounded-sm bg-muted ring-1 ring-border/30"
        aria-hidden
      >
        <Globe className="app-icon-xs text-muted-foreground" />
      </span>
    )
  }

  return (
    <img
      src={country.flag}
      alt=""
      aria-hidden
      width={20}
      height={15}
      className="app-icon-md shrink-0 rounded-sm object-cover shadow-sm ring-1 ring-border/30"
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}

export function CountryCodeSelector({
  value,
  onChange,
  preferredCountryIso,
  disabled = false,
  className = '',
}: CountryCodeSelectorProps) {
  const {
    isOpen,
    searchTerm,
    selectedCountry,
    filteredCountries,
    dropdownRef,
    toggleDropdown,
    handleSelect,
    handleSearch,
  } = useCountrySelector({
    countries: COUNTRIES,
    selectedCode: value,
    preferredCountryIso,
    onSelect: (country: Country) => {
      onChange(country.dialCode, getCountryIsoFromFlagUrl(country.flag))
    },
  })

  if (!selectedCountry) return null

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={toggleDropdown}
        className={cn(
          'flex min-h-[var(--ctrl-h)] w-full items-center justify-between rounded-xl border border-border bg-background px-[var(--ctrl-px)] py-2 shadow-sm transition-colors',
          'hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-ring/30',
          'disabled:cursor-not-allowed disabled:opacity-50'
        )}
      >
        <div className="flex items-center gap-2.5">
          <CountryFlag country={selectedCountry} />
          <div className="text-left">
            <div className="app-text-body text-foreground">{selectedCountry.dialCode}</div>
            <div className="app-typo-eyebrow text-muted-foreground">{selectedCountry.name}</div>
          </div>
        </div>
        <ChevronDown className={cn('app-icon-sm text-muted-foreground transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-[20rem] overflow-hidden rounded-2xl border border-border bg-popover shadow-xl">
          <div className="border-b border-border/60 p-3">
            <TextInputField
              label="Search country or code"
              icon={<Search className="app-icon-sm" />}
              value={searchTerm}
              onChange={handleSearch}
              autoFocus
            />
          </div>

          <ScrollArea className="h-72">
            <div className="space-y-1 p-2">
              {filteredCountries.map((country) => {
                const active =
                  country.dialCode === selectedCountry.dialCode &&
                  country.flag === selectedCountry.flag

                return (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleSelect(country)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors',
                      active
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-background text-foreground hover:bg-muted'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <CountryFlag country={country} />
                      <div>
                        <div className="app-text-body">{country.name}</div>
                        <div className={cn('app-text-caption', active ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
                          {country.dialCode} · {country.name}
                        </div>
                      </div>
                    </div>
                    {active ? <Check className="app-icon-sm shrink-0" /> : null}
                  </button>
                )
              })}

              {filteredCountries.length === 0 && (
                <div className="px-4 py-6 text-center app-text-body text-muted-foreground">No countries found</div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
