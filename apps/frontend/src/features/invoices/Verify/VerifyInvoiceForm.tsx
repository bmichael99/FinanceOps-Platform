import useFetchPrivate from '@/hooks/useFetchPrivate';
import React, { useEffect, useState } from 'react'
import {type Invoice} from "@finance-platform/types"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { invoiceFormSchema, type InvoiceFormType } from '@finance-platform/schemas';

type Props = {
  invoiceId: string
  invoiceData: Invoice,
  onSubmit: (data: InvoiceFormType, invoiceId: string) => Promise<void>,
  onDelete: (invoice: Invoice) => Promise<void>,
}

function VerifyInvoiceForm({invoiceId, invoiceData, onSubmit, onDelete}: Props) {
  const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false);
  const {register, handleSubmit, formState:{errors}} = useForm(
    //set default values to results from api request.
    
    {defaultValues: {
        CustomerName: invoiceData.CustomerName ?? undefined,
        InvoiceId: invoiceData.InvoiceId ?? undefined,
        InvoiceDate: invoiceData.InvoiceDate ? new Date(invoiceData.InvoiceDate).toISOString().split("T")[0] : undefined,
        DueDate: invoiceData.DueDate ? new Date(invoiceData.DueDate).toISOString().split("T")[0]: undefined,
        VendorName: invoiceData.VendorName ?? undefined,
        VendorAddress: invoiceData.VendorAddress ?? undefined,
        CustomerAddress: invoiceData.CustomerAddress ?? undefined,
        InvoiceTotal: invoiceData.InvoiceTotal || -1,
      },
    resolver: zodResolver(invoiceFormSchema)});

  return (
    <div>
      {invoiceId && <form onSubmit={handleSubmit(async (data) => {setIsSubmittingForm(true); await onSubmit(data, invoiceId);})}>
        <FieldGroup>
        {/*Required Fields*/}
        <FieldSet>
          <FieldLegend>Required Fields</FieldLegend>
          <FieldDescription>Important invoice information</FieldDescription>
          <FieldGroup className='grid grid-cols-2'>
            <Field data-invalid={errors.InvoiceTotal ? "true" : "false"}>
              <FieldLabel htmlFor="invoice-total">Invoice Total</FieldLabel>
              <Input {...register("InvoiceTotal")} type="number" step="0.01" id="invoice-total" aria-invalid={errors.InvoiceTotal && "true"}/>
              {errors.InvoiceTotal && <FieldError>{errors.InvoiceTotal.message}</FieldError>}
            </Field>
            <Field data-invalid={errors.InvoiceId ? "true" : "false"}>
              <FieldLabel htmlFor="invoice-id">Invoice ID</FieldLabel>
              <Input {...register("InvoiceId")} type="text" id="invoice-id" aria-invalid={errors.InvoiceId && "true"}/>
              {errors.InvoiceId && <FieldError>{errors.InvoiceId.message}</FieldError>}
            </Field>
            <Field data-invalid={errors.InvoiceDate ? "true" : "false"}>
              <FieldLabel htmlFor="invoice-date">Invoice Date</FieldLabel>
              <Input {...register("InvoiceDate")} type="date" id="invoice-date" aria-invalid={errors.InvoiceDate && "true"}/>
              {errors.InvoiceDate && <FieldError>{errors.InvoiceDate.message}</FieldError>}
            </Field>
            <Field data-invalid={errors.VendorName ? "true" : "false"}>
              <FieldLabel htmlFor="vendor-name">Vendor Name</FieldLabel>
              <Input {...register("VendorName")} type="text" id="vendor-name" aria-invalid={errors.VendorName && "true"}/>
              {errors.VendorName && <FieldError>{errors.VendorName.message}</FieldError>}
            </Field>
            <Field data-invalid={errors.CustomerName ? "true" : "false"}>
              <FieldLabel htmlFor="customer-name">Customer Name</FieldLabel>
              <Input {...register("CustomerName")} type="text" id="customer-name" aria-invalid={errors.CustomerName && "true"}/>
              {errors.CustomerName && <FieldError>{errors.CustomerName.message}</FieldError>}
            </Field>
          </FieldGroup>
        </FieldSet>
        <FieldSeparator />
        {/*Optional Fields*/}
        <FieldSet>
          <FieldLegend>Optional Fields</FieldLegend>
          <FieldDescription>Extra invoice information</FieldDescription>
          <FieldGroup className='grid grid-cols-2'>
            <Field data-invalid={errors.DueDate ? "true" : "false"}>
              <FieldLabel htmlFor="due-date">Due Date</FieldLabel>
              <Input {...register("DueDate")} type="date" id="due-date" aria-invalid={errors.DueDate && "true"}/>
              {errors.DueDate && <FieldError>{errors.DueDate.message}</FieldError>}
            </Field>
            <Field data-invalid={errors.VendorAddress ? "true" : "false"}>
              <FieldLabel htmlFor="vendor-address">Vendor Address</FieldLabel>
              <Input {...register("VendorAddress")} type="text" id="vendor-address" aria-invalid={errors.VendorAddress && "true"}/>
              {errors.VendorAddress && <FieldError>{errors.VendorAddress.message}</FieldError>}
            </Field>
            <Field data-invalid={errors.CustomerAddress ? "true" : "false"}>
              <FieldLabel htmlFor="customer-address">Customer Address</FieldLabel>
              <Input {...register("CustomerAddress")} type="text" id="customer-address" aria-invalid={errors.CustomerAddress && "true"}/>
              {errors.CustomerAddress && <FieldError>{errors.CustomerAddress.message}</FieldError>}
            </Field>
          </FieldGroup>
        </FieldSet>
        <Field orientation="horizontal"> 
          <Button disabled={isSubmittingForm ? true : false} type="submit">Submit</Button>
          <Button disabled={isSubmittingForm ? true : false} variant="destructive" type="button" onClick={async () => await onDelete(invoiceData)}>Delete Invoice</Button>
        </Field>
        </FieldGroup>
      </form>}
    </div>
  )
}

export default VerifyInvoiceForm