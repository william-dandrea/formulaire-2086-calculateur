"use client"

import { Formulaire2086 } from "@/components/Formulaire2086"
import { TableauFormulaire2086 } from "@/components/TableauFormulaire2086"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { InfoIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [lastFractionCapital, setLastFractionCapital] = useState<number>(0)
  const [formData, setFormData] = useState<{
    date: string;
    valeur_globale: number;
    prix_cession: number;
    frais_cession: number;
    soulte: number;
    prix_total_acquisition: number;
    soulte_recue_precedente: number;
  }[]>([])

  useEffect(() => {
    setMounted(true);
    try {
      const savedData = localStorage.getItem('formulaire_2086');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Vérifier que les données parsées sont bien un tableau
        setFormData(Array.isArray(parsedData) ? parsedData : []);
      }
    } catch (error) {
      console.error('Erreur lors de la lecture du localStorage:', error);
      setFormData([]);
    }
  }, [])

  if (!mounted) {
    return null;
  }

  return (
    <div className="m-10">
      <main className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Simulateur calcul de plus-value crypto (formulaire 2086)</h1>
        <h2 className="text-xl mb-8">
          Ce simulateur te permet de calculer ta plus-value crypto en fonction de tes transactions.
        </h2>

        <Alert variant="destructive" className="my-8">
          <AlertTitle>Ce simulateur ne remplace pas le formulaire 2086, il est juste à usage informatif, il ne remplace pas un vrai conseiller fiscal.</AlertTitle>
          <AlertDescription>
            Pour avoir un exemple de comment remplir le formulaire 2086, tu peux regarder cet article, il est super bien fait :
            <a href="https://bitcoin.fr/une-simulation-de-declaration-de-plus-values-issues-de-la-vente-dactifs-numeriques/" className="text-blue-500 underline">Simulation de plus-value crypto</a>
          </AlertDescription>
        </Alert>

        <Alert variant="default" className="my-8">
          <AlertTitle>Comment ça marche ?</AlertTitle>
          <AlertDescription>
            Tu peux avoir des informations sur chaque élément de ce formulaire en cliquant sur les icones d&apos;information.
            <ul>
              <li>
                <strong>ETAPE 1 :</strong> Entre tes informations préliminaires
              </li>
              <li>
                <strong>ETAPE 2 :</strong> Entre les différentes cessions
              </li>
            </ul>
          </AlertDescription>
        </Alert>
        <Separator className="my-8" />
        <h3 className="text-2xl font-semibold mb-4">ETAPE 1 : Informations préliminaires</h3>
        <div className="flex flex-col gap-1">
          <p className="">
            Quel est ta fraction de capital initial de l&apos;année dernière ? <span className="text-sm text-gray-500">(ligne 221 de la dernière cession de l&apos;année dernière)</span>
            <br />
            <span className="text-sm text-gray-500">(Si tu n&apos;as rien déclaré l&apos;année dernière, laisse le à 0)</span>
          </p>
          <Input type="number" value={lastFractionCapital} onChange={(e) => setLastFractionCapital(Number(e.target.value))} />
        </div>
        <Separator className="my-8" />



        <div className="flex flex-row gap-2">

          <h3 className="text-2xl font-semibold mb-4">ETAPE 2 : Entre tes différentes cessions</h3>
          <HoverCard>
            <HoverCardTrigger><InfoIcon className="" /></HoverCardTrigger>
            <HoverCardContent>
              Une cession est le moment ou tu as converti des cryptos en euros.
            </HoverCardContent>
          </HoverCard>

        </div>


        <Formulaire2086 formData={formData} setFormData={(data) => {
          setFormData(data)
          localStorage.setItem('formulaire_2086', JSON.stringify(data))
        }} />

        <Separator className="my-8" />

        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4">Formulaire 2086</h3>
          <TableauFormulaire2086
            formData={formData}
            setFormData={(data) => {
              setFormData(data)
              localStorage.setItem('formulaire_2086', JSON.stringify(data))
            }}
            lastFractionCapital={lastFractionCapital}
          />

          <Alert variant="destructive" className="mt-8">
            <AlertTitle>Montant d&apos;impot estimé (à la flat tax à 30%)</AlertTitle>
            <AlertDescription>
              {localStorage.getItem('pv') ? (Number(localStorage.getItem('pv')) * 0.3).toFixed(2) : '0.00'} €
            </AlertDescription>
          </Alert>
        </div>

        <Separator className="my-8" />

        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4">Conclusion</h3>
          <p>
            Ce projet est open-source, tu peux le retrouver sur <a href="https://github.com/william-dandrea/formulaire-2086-calculateur" className="text-blue-500 underline">GitHub</a>.
          </p>
          <p>
            Si tu cherches un développeur, tu peux me contacter sur <a href="https://x.com/DandreaWilliam" className="text-blue-500 underline">Twitter</a>.
          </p>
        </div>

        <Alert variant="default" className="mt-8">
          <AlertTitle>
            Avis de non-responsabilité
          </AlertTitle>
          <AlertDescription>
            Ce simulateur est à usage informatif, il ne remplace pas un vrai conseiller fiscal.
          </AlertDescription>
        </Alert>


      </main>
    </div>
  );
}
