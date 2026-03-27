import AMapLoader from "@amap/amap-jsapi-loader";

// Type definitions for AMap
declare global {
  interface Window {
    _AMapSecurityConfig: {
      securityJsCode: string;
    };
  }
}

// Use any type since AMap types are not well supported in TypeScript
let amapInstance: any = null;
let loaderPromise: Promise<any> | null = null;

export const loadAMap = async (container: HTMLElement, options?: Record<string, unknown>) => {
  if (amapInstance) return amapInstance;
  if (loaderPromise) return loaderPromise;

  // Set security configuration
  if (typeof window !== "undefined") {
    (window as any)._AMapSecurityConfig = {
      securityJsCode: process.env.NEXT_PUBLIC_AMAP_SECURITY_KEY || "",
    };
  }

  loaderPromise = AMapLoader.load({
    key: process.env.NEXT_PUBLIC_AMAP_KEY || "",
    version: "2.0",
    plugins: [
      "AMap.Driving",
      "AMap.Walking",
      "AMap.Transfer",
      "AMap.Riding",
      "AMap.Geocoder",
      "AMap.PlaceSearch",
      "AMap.InfoWindow",
      "AMap.Marker",
      "AMap.Polyline",
      "AMap.Text",
    ],
  })
    .then((AMap: any) => {
      amapInstance = new AMap.Map(container, {
        zoom: 11,
        viewMode: "2D",
        pitch: 0,
        ...options,
      });
      return amapInstance;
    })
    .catch((error: Error) => {
      console.error("Failed to load AMap:", error);
      loaderPromise = null;
      throw error;
    });

  return loaderPromise;
};

export const destroyAMap = () => {
  if (amapInstance) {
    amapInstance.destroy();
    amapInstance = null;
    loaderPromise = null;
  }
};
