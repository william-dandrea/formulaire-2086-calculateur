"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Check, Trash2 } from "lucide-react"

export interface FormDataEntry {
  date: string;
  valeur_globale: number;
  prix_cession: number;
  frais_cession: number;
  soulte: number;
  prix_total_acquisition: number;
  soulte_recue_precedente: number;
}

interface CalculatedEntry extends FormDataEntry {
  prix_net_soultes: number;
  prix_net_frais_soultes: number;
  fraction_capital: number;
  prix_total_acquisition_net: number;
  plus_value: number;
}

function calculateValues(formData: FormDataEntry[], lastFractionCapital: number): CalculatedEntry[] {
  return formData.map((entry, index) => {
    const prix_net_soultes = entry.prix_cession - entry.soulte;
    const prix_net_frais_soultes = entry.prix_cession - entry.frais_cession - entry.soulte;

    let fraction_capital = lastFractionCapital;
    if (index > 0) {
      const prev_entry = formData[index - 1];
      const prev_prix_net_soultes = prev_entry.prix_cession - prev_entry.soulte;
      fraction_capital = entry.prix_total_acquisition * (prev_prix_net_soultes / prev_entry.valeur_globale);
    }

    const prix_total_acquisition_net = entry.prix_total_acquisition - fraction_capital - entry.soulte_recue_precedente;
    const plus_value = prix_net_frais_soultes - (prix_total_acquisition_net * (prix_net_soultes / entry.valeur_globale));

    return {
      ...entry,
      prix_net_soultes,
      prix_net_frais_soultes,
      fraction_capital,
      prix_total_acquisition_net,
      plus_value,
    };
  });
}

interface EditableFieldProps {
  value: number | string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (value: number | string) => void;
  type?: "number" | "text" | "date";
}

function EditableField({ value, isEditing, onEdit, onSave, type = "number" }: EditableFieldProps) {
  const [tempValue, setTempValue] = useState(value);

  return (
    <div className="flex items-center justify-center gap-2">
      {isEditing ? (
        <div className="flex gap-1">
          <Input
            type={type}
            value={tempValue}
            onChange={(e) => setTempValue(type === "number" ? Number(e.target.value) : e.target.value)}
            className="w-32"
            step={type === "number" ? "0.01" : undefined}
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              onSave(tempValue);
            }}
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          {type === "number" ? `${Number(value).toFixed(2)} €` : value}
          <Button
            size="icon"
            variant="ghost"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}

export function TableauFormulaire2086({ 
  formData, 
  setFormData,
  lastFractionCapital,
}: { 
  formData: FormDataEntry[], 
  setFormData: (data: FormDataEntry[]) => void,
  lastFractionCapital: number 
}) {
  const calculatedData = calculateValues(formData, lastFractionCapital);
  const [editingCell, setEditingCell] = useState<{ row: string; col: number } | null>(null);

  localStorage.setItem('pv', calculatedData.reduce((acc, curr) => acc + curr.plus_value, 0).toString());

  const handleEdit = (field: keyof FormDataEntry, index: number, value: number | string) => {
    const newFormData = [...formData];
    newFormData[index] = {
      ...newFormData[index],
      [field]: value
    };
    setFormData(newFormData);
    setEditingCell(null);
  };

  const handleDelete = (index: number) => {
    setFormData(formData.filter((_, i) => i !== index));
  };

//   const editableFields: (keyof FormDataEntry)[] = [
//     "date",
//     "valeur_globale",
//     "prix_cession",
//     "frais_cession",
//     "soulte",
//     "prix_total_acquisition",
//     "soulte_recue_precedente"
//   ];

  return (
    <div className="border rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]"></TableHead>
            {calculatedData.map((_, index) => (
              <TableHead key={index} className="text-center">
                Cession {index + 1}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">211 - Date de la cession</TableCell>
            {calculatedData.map((entry, index) => (
              <TableCell key={index} className="text-center">
                <EditableField
                  value={entry.date}
                  isEditing={editingCell?.row === "date" && editingCell.col === index}
                  onEdit={() => setEditingCell({ row: "date", col: index })}
                  onSave={(value) => handleEdit("date", index, value)}
                  type="date"
                />
              </TableCell>
            ))}
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">212 - Valeur globale du portefeuille</TableCell>
            {calculatedData.map((entry, index) => (
              <TableCell key={index} className="text-center">
                <EditableField
                  value={entry.valeur_globale}
                  isEditing={editingCell?.row === "valeur_globale" && editingCell.col === index}
                  onEdit={() => setEditingCell({ row: "valeur_globale", col: index })}
                  onSave={(value) => handleEdit("valeur_globale", index, Number(value))}
                />
              </TableCell>
            ))}
          </TableRow>

          <TableRow>
            <TableCell className="font-medium bg-gray-50" colSpan={calculatedData.length + 1}>
              Détermination du prix de cession
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">213 - Prix de cession</TableCell>
            {calculatedData.map((entry, index) => (
            //   <TableCell key={index} className="text-center">{entry.prix_cession.toFixed(2)} €</TableCell>
            <TableCell key={index} className="text-center">
                <EditableField
                  value={entry.prix_cession}
                  isEditing={editingCell?.row === "prix_cession" && editingCell.col === index}
                  onEdit={() => setEditingCell({ row: "prix_cession", col: index })}
                  onSave={(value) => handleEdit("prix_cession", index, Number(value))}
                />
            </TableCell>
            ))}
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">214 - Frais de cession</TableCell>
            {calculatedData.map((entry, index) => (
            //   <TableCell key={index} className="text-center">{entry.frais_cession.toFixed(2)} €</TableCell>
            <TableCell key={index} className="text-center">
                <EditableField
                  value={entry.frais_cession}
                  isEditing={editingCell?.row === "frais_cession" && editingCell.col === index}
                  onEdit={() => setEditingCell({ row: "frais_cession", col: index })}
                  onSave={(value) => handleEdit("frais_cession", index, Number(value))}
                />
            </TableCell>
            ))}
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">216 - Soulte reçue/versée</TableCell>
            {calculatedData.map((entry, index) => (
            //   <TableCell key={index} className="text-center">{entry.soulte.toFixed(2)} €</TableCell>
            <TableCell key={index} className="text-center">
                <EditableField
                  value={entry.soulte}
                  isEditing={editingCell?.row === "soulte" && editingCell.col === index}
                  onEdit={() => setEditingCell({ row: "soulte", col: index })}
                  onSave={(value) => handleEdit("soulte", index, Number(value))}
                />
            </TableCell>
            ))}

          </TableRow>

          <TableRow>
            <TableCell className="font-medium">217 - Prix net des soultes</TableCell>
            {calculatedData.map((entry, index) => (
              <TableCell key={index} className="text-center">{entry.prix_net_soultes.toFixed(2)} €</TableCell>
            ))}
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">218 - Prix net frais + soultes</TableCell>
            {calculatedData.map((entry, index) => (
              <TableCell key={index} className="text-center">{entry.prix_net_frais_soultes.toFixed(2)} €</TableCell>
            ))}
          </TableRow>

          <TableRow>
            <TableCell className="font-medium bg-gray-50" colSpan={calculatedData.length + 1}>
              {`Détermination du prix total d'acquisition`}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">220 - Prix total d&apos;acquisition</TableCell>
            {calculatedData.map((entry, index) => (
            //   <TableCell key={index} className="text-center">{entry.prix_total_acquisition.toFixed(2)} €</TableCell>
            <TableCell key={index} className="text-center">
                <EditableField
                  value={entry.prix_total_acquisition}
                  isEditing={editingCell?.row === "prix_total_acquisition" && editingCell.col === index}
                  onEdit={() => setEditingCell({ row: "prix_total_acquisition", col: index })}
                  onSave={(value) => handleEdit("prix_total_acquisition", index, Number(value))}
                />
            </TableCell>
            ))}
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">221 - Fraction de capital</TableCell>
            {calculatedData.map((entry, index) => (
              <TableCell key={index} className="text-center">{entry.fraction_capital.toFixed(2)} €</TableCell>
            ))}
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">222 - Soultes reçues (échanges antérieurs)</TableCell>
            {calculatedData.map((entry, index) => (
              <TableCell key={index} className="text-center">{entry.soulte_recue_precedente.toFixed(2)} €</TableCell>
            ))}
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">223 - Prix total acquisition net</TableCell>
            {calculatedData.map((entry, index) => (
              <TableCell key={index} className="text-center">{entry.prix_total_acquisition_net.toFixed(2)} €</TableCell>
            ))}
          </TableRow>

          <TableRow className="bg-gray-50 font-bold">
            <TableCell>224 - Plus-value ou moins-value</TableCell>
            {calculatedData.map((entry, index) => (
              <TableCell key={index} className="text-center">
                {entry.plus_value.toFixed(2)} €
              </TableCell>
            ))}
          </TableRow>

          <TableRow>
            <TableCell></TableCell>
            {calculatedData.map((_, index) => (
              <TableCell key={index} className="text-center">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(index)}
                  className="mt-2"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Supprimer la cession
                </Button>
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
} 