import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RotateCcw } from "lucide-react";

interface Theme {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: string;
}

interface ThemePickerProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const defaultTheme: Theme = {
  primaryColor: "#3b82f6",
  backgroundColor: "#ffffff",
  textColor: "#1e293b",
  borderRadius: "8px"
};

export function ThemePicker({ theme, onThemeChange }: ThemePickerProps) {
  const handleColorChange = (key: keyof Theme, value: string) => {
    onThemeChange({ ...theme, [key]: value });
  };

  const resetToDefault = () => {
    onThemeChange(defaultTheme);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Aparência do Widget</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={resetToDefault}
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Tema Padrão
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="primaryColor">Cor Principal</Label>
          <div className="flex gap-2">
            <input
              id="primaryColor"
              type="color"
              value={theme.primaryColor}
              onChange={(e) => handleColorChange('primaryColor', e.target.value)}
              className="w-12 h-10 rounded border border-border cursor-pointer"
            />
            <input
              type="text"
              value={theme.primaryColor}
              onChange={(e) => handleColorChange('primaryColor', e.target.value)}
              className="flex-1 px-3 py-2 rounded border border-border bg-background text-foreground"
              placeholder="#3b82f6"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="backgroundColor">Cor de Fundo</Label>
          <div className="flex gap-2">
            <input
              id="backgroundColor"
              type="color"
              value={theme.backgroundColor}
              onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
              className="w-12 h-10 rounded border border-border cursor-pointer"
            />
            <input
              type="text"
              value={theme.backgroundColor}
              onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
              className="flex-1 px-3 py-2 rounded border border-border bg-background text-foreground"
              placeholder="#ffffff"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="textColor">Cor do Texto</Label>
          <div className="flex gap-2">
            <input
              id="textColor"
              type="color"
              value={theme.textColor}
              onChange={(e) => handleColorChange('textColor', e.target.value)}
              className="w-12 h-10 rounded border border-border cursor-pointer"
            />
            <input
              type="text"
              value={theme.textColor}
              onChange={(e) => handleColorChange('textColor', e.target.value)}
              className="flex-1 px-3 py-2 rounded border border-border bg-background text-foreground"
              placeholder="#1e293b"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="borderRadius">Arredondamento (px)</Label>
          <input
            id="borderRadius"
            type="text"
            value={theme.borderRadius}
            onChange={(e) => handleColorChange('borderRadius', e.target.value)}
            className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
            placeholder="8px"
          />
        </div>
      </div>

      <div className="mt-6 p-4 rounded-lg border border-border">
        <p className="text-sm text-muted-foreground mb-3">Preview:</p>
        <div
          className="p-4 rounded shadow-lg"
          style={{
            backgroundColor: theme.backgroundColor,
            color: theme.textColor,
            borderRadius: theme.borderRadius
          }}
        >
          <h4 className="font-semibold mb-2">Tour Step Title</h4>
          <p className="text-sm mb-3">This is how your tooltip will look.</p>
          <button
            style={{
              backgroundColor: theme.primaryColor,
              color: '#ffffff',
              borderRadius: theme.borderRadius,
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Next Step
          </button>
        </div>
      </div>
    </Card>
  );
}
