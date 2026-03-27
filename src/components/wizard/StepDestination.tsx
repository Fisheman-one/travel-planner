"use client";

import { useState } from "react";
import { useWizardStore } from "@/store/wizardStore";
import { CITIES } from "@/data/mock-itineraries";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { MapPin, Search } from "lucide-react";

export function StepDestination() {
  const { preferences, updatePreferences } = useWizardStore();
  const [searchQuery, setSearchQuery] = useState("");

  const selectedCity = preferences.destination?.city || "";
  const coordinates = preferences.destination?.coordinates || [];

  const filteredCities = CITIES.filter(
    (city) =>
      city.name.includes(searchQuery) || city.description.includes(searchQuery)
  );

  const handleSelectCity = (city: (typeof CITIES)[0]) => {
    updatePreferences({
      destination: {
        city: city.name,
        country: city.country,
        coordinates: city.coordinates,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索城市..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
        />
      </div>

      {/* Popular cities */}
      <div>
        <h3 className="text-sm font-medium text-text-muted mb-4">热门目的地</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredCities.map((city) => (
            <Card
              key={city.name}
              variant={selectedCity === city.name ? "elevated" : "outlined"}
              padding="md"
              className={cn(
                "cursor-pointer transition-all duration-200 hover:-translate-y-1",
                selectedCity === city.name &&
                  "ring-2 ring-accent border-accent bg-accent/5"
              )}
              onClick={() => handleSelectCity(city)}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                    selectedCity === city.name
                      ? "bg-accent text-white"
                      : "bg-gray-100 text-gray-500"
                  )}
                >
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-primary">{city.name}</h4>
                  <p className="text-xs text-text-muted mt-1 line-clamp-2">
                    {city.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Selected city info */}
      {selectedCity && (
        <div className="p-4 bg-accent/10 rounded-xl border border-accent/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm text-text-muted">已选择</p>
              <p className="font-semibold text-primary">{selectedCity}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
