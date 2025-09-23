export const PALETTES = {
    Vintage: {
      bg: "bg-[#FFF8F1]",
      text: "text-[#2B1D0E]",
      accent: "#D95F59",
      accentSoft: "#F4D06F",
      card: "bg-white",
      cardBorder: "border-[#EBDDC6]",
      colors: ["#D95F59", "#F4D06F", "#3AAFA9", "#7E6B8F", "#2D728F"],
    },
    Retro: {
      bg: "bg-[#FCEFEA]",
      text: "text-[#2E1E32]",
      accent: "#7D5BA6",
      accentSoft: "#FEC3A6",
      card: "bg-[#FFF8E7]",
      cardBorder: "border-[#E8D5B7]",
      colors: ["#7D5BA6", "#FEC3A6", "#FF8C42", "#4E937A"],
    },
    Pastel: {
      bg: "bg-[#FFF1F2]",
      text: "text-[#2B1C1C]",
      accent: "#EF476F",
      accentSoft: "#FFD166",
      card: "bg-[#E6F2FF]",
      cardBorder: "border-[#BBD6FF]",
      colors: ["#EF476F", "#FFD166", "#06D6A0", "#118AB2"],
    },
  } as const;
  
export type PaletteName = keyof typeof PALETTES;
export type Palette = (typeof PALETTES)[PaletteName];