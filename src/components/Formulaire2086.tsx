"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { FormDataEntry } from "./TableauFormulaire2086"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { InfoIcon } from "lucide-react";
const formSchema = z.object({
  date: z.date(),
  valeur_globale: z.number(),
  prix_cession: z.number(),
  frais_cession: z.number(),
  soulte: z.number(),
  prix_total_acquisition: z.number(),
  soulte_recue_precedente: z.number(),
})



export function Formulaire2086({ formData, setFormData }: { formData: FormDataEntry[], setFormData: (data: FormDataEntry[]) => void }) {


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      valeur_globale: 0,
      prix_cession: 0,
      frais_cession: 0,
      soulte: 0,
      prix_total_acquisition: 0,
      soulte_recue_precedente: 0,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newEntry = {
      date: format(values.date, "yyyy-MM-dd"),
      valeur_globale: Number(values.valeur_globale),
      prix_cession: Number(values.prix_cession),
      frais_cession: Number(values.frais_cession),
      soulte: Number(values.soulte),
      prix_total_acquisition: Number(values.prix_total_acquisition),
      soulte_recue_precedente: Number(values.soulte_recue_precedente),
    }

    const updatedData = [...formData, newEntry]
    setFormData(updatedData)

    // Réinitialiser le formulaire
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Date de la cession</h3>
            <p className="text-sm text-gray-500">Sélectionnez la date la cession (le jour ou tu as vendu tes cryptos)</p>
          </div>
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Choisir une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <h3 className="font-semibold">Valeur totale du portefeuille</h3>
            <p className="text-sm text-gray-500">
              Dès que tu fais une cession, il faut noter la valeur totale de ton portefeuille (toutes tes cryptos confondues) en euros. Si tu n&apos;as pas cette valeur, essaye de retrouver la valeur de ton portefeuille la veille de la cession sur ton exchange.
            </p>
          </div>
          <FormField
            control={form.control}
            name="valeur_globale"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    type="number" 
                    value={field.value} 
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <h3 className="font-semibold">Montant de la cession</h3>
            <p className="text-sm text-gray-500">
              C&apos;est le montant en EUR que tu as reçu lors de la cession. (En gros, si tu as vendu pour 500EUR de BTC, tu dois mettre 500 ici)
            </p>
          </div>
          <FormField
            control={form.control}
            name="prix_cession"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="number" step="0.01" value={field.value} onChange={(e) => {
                    field.onChange(Number(e.target.value))
                  }} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <h3 className="font-semibold">Frais de cession</h3>
            <p className="text-sm text-gray-500">
              C&apos;est les frais qui t&apos;ont été pris lors de cette cession.
            </p>
          </div>
          <FormField
            control={form.control}
            name="frais_cession"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="number" step="0.01" value={field.value} onChange={(e) => {
                    field.onChange(Number(e.target.value))
                  }} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <h3 className="font-semibold">Soulte</h3>
            <p className="text-sm text-gray-500">
              C&apos;est si jamais tu as eu des EUR à travers des échanges cryptos/cryptos. Si tu as des soultes, essaye plutot de passer par un service comme waltio ou autre.
            </p>
          </div>
          <FormField
            control={form.control}
            name="soulte"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="number" step="0.01" value={field.value} onChange={(e) => {
                    field.onChange(Number(e.target.value))
                  }} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <h3 className="font-semibold">Prix total d&apos;acquisition</h3>
            <p className="text-sm text-gray-500">
              C&apos;est le montant initial en euros que tu as investi. En gros, si tu as investi 1000EUR en crypto, met 1000 ici. Si jamais tu as déjà fait une cession, et que tu as pas réinvesti depuis, remet le même montant. Si tu as réinvesti 200EUR depuis la dernière cession, dans ce cas la, met ici 1200 (1000 + 200).
            </p>
          </div>
          <FormField
            control={form.control}
            name="prix_total_acquisition"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="number" step="0.01" value={field.value} onChange={(e) => {
                    field.onChange(Number(e.target.value))
                  }} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <h3 className="font-semibold">Soulte reçue précédente</h3>
            <p className="text-sm text-gray-500">
              Si tu as déjà fait une cession, et que tu as eu des soultes, met le montant ici.
            </p>
          </div>
          <FormField
            control={form.control}
            name="soulte_recue_precedente"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="number" step="0.01" value={field.value} onChange={(e) => {
                    field.onChange(Number(e.target.value))
                  }} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end mt-6">
          <Button type="submit">Ajouter la cession</Button>
        </div>
      </form>
    </Form>
  )
} 