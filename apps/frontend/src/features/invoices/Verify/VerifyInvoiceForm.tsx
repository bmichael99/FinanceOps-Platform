import useFetchPrivate from '@/hooks/useFetchPrivate';
import React, { useEffect, useState } from 'react'
import {type UnprocessedInvoice} from "@finance-platform/types"
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
import { useNavigate } from 'react-router-dom';

type Props = {
  invoiceId: string
  invoiceData: UnprocessedInvoice
}

function VerifyInvoiceForm({invoiceId, invoiceData}: Props) {
  const fetchPrivate = useFetchPrivate();
  const navigate = useNavigate();
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
        InvoiceTotal: Number(invoiceData.InvoiceTotal?.replace(/[$,]/g,"")) || -1,
      },
    resolver: zodResolver(invoiceFormSchema)});

  async function submitForm(data: InvoiceFormType){
    console.log(data);
    const response = await fetchPrivate({endpoint: `/unprocessed-invoices/${invoiceId}/verify`, method: "POST", bodyData: JSON.stringify(data), content_type: "application/json"}); //
    console.log(response);
    if (response.status == 200){
      navigate("/dashboard/invoices/verify");
    }
  }

  return (
    <div>
      {invoiceId && <form onSubmit={handleSubmit(async (data) => {await submitForm(data);})}>
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
          <Button type="submit">Submit</Button>
          <Button variant="destructive" type="button">Delete Invoice</Button>
        </Field>
        </FieldGroup>
      </form>}
    </div>
  )
}

export default VerifyInvoiceForm