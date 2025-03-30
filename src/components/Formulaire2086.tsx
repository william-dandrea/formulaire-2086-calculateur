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
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date de la cession</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
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

        <FormField
          control={form.control}
          name="valeur_globale"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex flex-row gap-2">
                Valeur totale du portefeuille au moment de la cession
                <HoverCard>
                  <HoverCardTrigger asChild><InfoIcon className="" /></HoverCardTrigger>
                  <HoverCardContent>
                    Dès que vous faites une cession, il faut noter la valeur totale de votre portefeuille (toutes vos cryptos confondues) en euros. Si vous n&apos;avez pas cette valeur, essayez de retrouver la valeur de votre portefeuille la veille de la cession sur votre exchange.
                  </HoverCardContent>
                </HoverCard>
              </FormLabel>
              
              <FormControl>
                <Input type="number" value={field.value} onChange={(e) => {
                  field.onChange(Number(e.target.value))
                }} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="prix_cession"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex flex-row gap-2">
                Montant de la cession
                <HoverCard>
                  <HoverCardTrigger asChild><InfoIcon className="" /></HoverCardTrigger>
                  <HoverCardContent>
                    C&apos;est le montant en EUR que tu as reçu lors de la cession. (En gros, si tu as vendu pour 500EUR de BTC, tu dois mettre 500 ici)
                  </HoverCardContent>
                </HoverCard>
              </FormLabel>
              <FormControl>
                <Input type="number" step="0.01" value={field.value} onChange={(e) => {
                  field.onChange(Number(e.target.value))
                }} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="frais_cession"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Frais de cession
                <HoverCard>
                  <HoverCardTrigger asChild><InfoIcon className="" /></HoverCardTrigger>
                  <HoverCardContent>
                    C&apos;est les frais qui t&apos;ont été pris lors de cette cession.
                  </HoverCardContent>
                </HoverCard>
              </FormLabel>
              <FormControl>
                <Input type="number" step="0.01" value={field.value} onChange={(e) => {
                  field.onChange(Number(e.target.value))
                }} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="soulte"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Soulte
                <HoverCard>
                  <HoverCardTrigger asChild><InfoIcon className="" /></HoverCardTrigger>
                  <HoverCardContent>
                    C&apos;est si jamais tu as eu des EUR à travers des échanges cryptos/cryptos. Si tu as des soultes, essaye plutot de passer par un service comme waltio ou autre.
                  </HoverCardContent>
                </HoverCard>
              </FormLabel>
              <FormControl>
                <Input type="number" step="0.01" value={field.value} onChange={(e) => {
                  field.onChange(Number(e.target.value))
                }} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="prix_total_acquisition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Prix total d&apos;acquisition
                <HoverCard>
                  <HoverCardTrigger asChild><InfoIcon className="" /></HoverCardTrigger>
                  <HoverCardContent>
                    C&apos;est le montant initial en euros que tu as investi. En gros, si tu as investi 1000EUR en crypto, met 1000 ici. Si jamais tu as déjà fait une cession, et que tu as pas réinvesti depuis, remet le même montant. Si tu as réinvesti depuis la dernière cession, dans ce cas la, ajoute a ces 1000EUR le montant que tu as réinvesti.
                  </HoverCardContent>
                </HoverCard>
              </FormLabel>
              <FormControl>
                <Input type="number" step="0.01" value={field.value} onChange={(e) => {
                  field.onChange(Number(e.target.value))
                }} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="soulte_recue_precedente"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Soulte reçue précédente
                <HoverCard>
                  <HoverCardTrigger asChild><InfoIcon className="" /></HoverCardTrigger>
                  <HoverCardContent>
                    Si tu as déjà fait une cession, et que tu as eu des soultes, met le montant ici.
                  </HoverCardContent>
                </HoverCard>
              </FormLabel>
              <FormControl>
                <Input type="number" step="0.01" value={field.value} onChange={(e) => {
                  field.onChange(Number(e.target.value))
                }} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Ajouter la cession</Button>
      </form>
    </Form>
  )
} 