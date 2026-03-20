"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  IconSun,
  IconCloud,
  IconCloudRain,
  IconCloudSnow,
  IconCloudStorm,
  IconCloudFog,
  IconMapPin
} from "@tabler/icons-react";

export interface WeatherData {
  location: {
    name: string;
    country: string;
    localtime: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      code: number;
    };
  };
}

interface WeatherCardProps {
  weatherData: WeatherData;
}

const getWeatherIcon = (code: number) => {
  if (code === 1000) return <IconSun className="w-10 h-10 text-yellow-400" />;
  if ([1003, 1006, 1009].includes(code)) return <IconCloud className="w-10 h-10 text-gray-400" />;
  if ([1030, 1135, 1147].includes(code)) return <IconCloudFog className="w-10 h-10 text-gray-300" />;
  if ([1063, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(code))
    return <IconCloudRain className="w-10 h-10 text-blue-400" />;
  if ([1066, 1069, 1072, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(code))
    return <IconCloudSnow className="w-10 h-10 text-blue-100" />;
  if ([1087, 1273, 1276, 1279, 1282].includes(code))
    return <IconCloudStorm className="w-10 h-10 text-purple-400" />;
  return <IconCloud className="w-10 h-10 text-gray-400" />;
};

export const WeatherCard = ({ weatherData }: WeatherCardProps) => {
  const { location, current } = weatherData;

  return (
    <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-lg border-muted/50 bg-card/60 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <IconMapPin className="w-5 h-5 text-primary" />
              {location.name}
            </CardTitle>
            <CardDescription className="text-xs uppercase tracking-wider font-medium opacity-70">
              {location.country} • {location.localtime.split(" ")[1]}
            </CardDescription>
          </div>
          <div className="p-2 rounded-2xl bg-muted/30">
            {getWeatherIcon(current.condition.code)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-xl! font-extrabold tracking-tighter">
            {Math.round(current.temp_c)}° C | {current.condition.text}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};