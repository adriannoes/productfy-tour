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
            <h2 className="text-2xl font-bold text-foreground mb-2">Código de Integração</h2>
            <p className="text-muted-foreground">
              Adicione este código ao seu site para ativar o product tour
            </p>
          </div>
          <Button onClick={copyToClipboard} className="bg-gradient-primary">
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copiar Código
              </>
            )}
          </Button>
        </div>

        <div className="relative">
          <pre className="bg-muted p-6 rounded-lg overflow-x-auto">
            <code className="text-sm text-foreground font-mono">{generateIntegrationCode()}</code>
          </pre>
        </div>
      </Card>

      <Card className="p-6 bg-card/50 border-primary/20">
        <h3 className="text-lg font-semibold text-foreground mb-4">Instruções de Instalação</h3>
        <ol className="space-y-3 text-muted-foreground">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-semibold">
              1
            </span>
            <span>Copie o código acima usando o botão "Copiar Código"</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-semibold">
              2
            </span>
            <span>
              Cole o código dentro da tag <code className="bg-muted px-2 py-1 rounded">&lt;head&gt;</code> do seu site
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-semibold">
              3
            </span>
            <span>Certifique-se de que os seletores CSS correspondem aos elementos do seu site</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-semibold">
              4
            </span>
            <span>Teste o tour acessando seu site e verificando se o tour é exibido corretamente</span>
          </li>
        </ol>
      </Card>

      <Card className="p-6 bg-accent/10 border-accent/20">
        <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
          <span className="text-accent">⚡</span>
          Dica Profissional
        </h3>
        <p className="text-muted-foreground">
          Para uma integração mais avançada, você pode usar nossa API JavaScript para controlar o tour
          programaticamente. Chame <code className="bg-muted px-2 py-1 rounded">TourFlow.start()</code> para
          iniciar o tour manualmente ou <code className="bg-muted px-2 py-1 rounded">TourFlow.stop()</code> para
          interrompê-lo.
        </p>
      </Card>
    </div>
  );
};
