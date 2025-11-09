
import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function App() {
  const [open, setOpen] = useState(false)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Teste do shadcn/ui</h1>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Abrir Modal com Alerta
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modal de Alerta</DialogTitle>
            <DialogDescription>
              Este é um modal contendo alertas do shadcn/ui.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert>
              <AlertTitle>✅ Sucesso!</AlertTitle>
              <AlertDescription>
                O modal está funcionando perfeitamente!
              </AlertDescription>
            </Alert>
            
            <Alert variant="destructive">
              <AlertTitle>⚠️ Atenção</AlertTitle>
              <AlertDescription>
                Este é um alerta de erro dentro do modal.
              </AlertDescription>
            </Alert>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

