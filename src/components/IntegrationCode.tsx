import { useState } from "react";
import { Tour } from "@/pages/Index";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

type IntegrationCodeProps = {
  tour: Tour;
};

export const IntegrationCode = ({ tour }: IntegrationCodeProps) => {
  const [copied, setCopied] = useState(false);

  const generateIntegrationCode = () => {
    const tourData = JSON.stringify(tour, null, 2);
    
    return `<!-- TourFlow Integration -->
<script>
  window.tourFlowConfig = ${tourData};
</script>
<script src="https://cdn.tourflow.app/widget.js"></script>
<link rel="stylesheet" href="https://cdn.tourflow.app/widget.css" />

<script>
  // Initialize TourFlow
  document.addEventListener('DOMContentLoaded', function() {
    TourFlow.init({
      tourId: '${tour.id}',
      autoStart: ${tour.isActive},
      onComplete: function() {
        console.log('Tour completed!');
      },
      onSkip: function() {
        console.log('Tour skipped!');
      }
    });
  });
</script>`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateIntegrationCode());
    setCopied(true);
    toast.success("Código copiado para a área de transferência!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2 tracking-tight">Integration Code</h2>
            <p className="text-muted-foreground text-sm">
              Add this snippet to your site
            </p>
          </div>
          <Button onClick={copyToClipboard}>
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </>
            )}
          </Button>
        </div>

        <div className="relative">
          <pre className="bg-card border border-border p-5 rounded-lg overflow-x-auto">
            <code className="text-xs text-foreground/90 font-mono">{generateIntegrationCode()}</code>
          </pre>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="text-sm font-medium text-foreground mb-4">Installation</h3>
        <ol className="space-y-3 text-muted-foreground text-sm">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-5 h-5 bg-muted text-foreground rounded flex items-center justify-center text-xs font-medium">
              1
            </span>
            <span>Copy the code snippet above</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-5 h-5 bg-muted text-foreground rounded flex items-center justify-center text-xs font-medium">
              2
            </span>
            <span>
              Paste it in your <code className="bg-muted px-1.5 py-0.5 rounded text-xs">&lt;head&gt;</code> tag
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-5 h-5 bg-muted text-foreground rounded flex items-center justify-center text-xs font-medium">
              3
            </span>
            <span>Ensure CSS selectors match your site elements</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-5 h-5 bg-muted text-foreground rounded flex items-center justify-center text-xs font-medium">
              4
            </span>
            <span>Test the tour on your site</span>
          </li>
        </ol>
      </Card>
    </div>
  );
};
