import AddSalesOrder from "@/components/salesOrder/createSalesOrder/AddSalesOrder";
import CreateSalesOrder from "@/components/salesOrder/createSalesOrder/CreateSalesOrder";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  fetchBillingAddressList,
  fetchClient,
  fetchClientAddressDetail,
  fetchClientDetails,
  fetchCountries,
  fetchcurrency,
  fetchStates,
} from "@/features/salesmodule/createSalesOrderSlice";
import { createSalesFormSchema } from "@/schema/salesorder/createsalesordeschema";
import { AppDispatch, RootState } from "@/store";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RowData } from "@/config/agGrid/SalseOrderCreateTableColumns";
import { ChannelType } from "@/types/createSalesOrderTypes";
import { useParams } from "react-router-dom";
import { fetchDataForUpdate } from "@/features/salesmodule/SalesSlice";
import { fetchchannelList } from "@/features/client/clientSlice";

const CreateSalesOrderPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const pathname = window.location.pathname;
  const [tabvalue, setTabvalue] = useState<string>("create");
  const [payloadData, setPayloadData] = useState<any>(null);
  const [channel, setChannel] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [derivedType, setDerivedType] = useState<string>("");
  const data = useSelector((state: RootState) => state.createSalesOrder);
  const { updateData } = useSelector((state: RootState) => state.sellRequest);
  const form = useForm<z.infer<typeof createSalesFormSchema>>({
    resolver: zodResolver(createSalesFormSchema),
    mode: "onBlur",
  });
console.log(updateData,"updateData")

  const handleClientChange = (e: any) => {
    form.setValue("customer_branch", e.value, {
      shouldValidate: true,
      shouldDirty: true,
    });
    dispatch(fetchClientAddressDetail({ addressID: e.value })).then(
      (response: any) => {
        if (response.meta.requestStatus === "fulfilled") {
          const data = response.payload;
          form.setValue("customer_gstin", data.gst, {
            shouldValidate: true,
            shouldDirty: true,
          });
          form.setValue("place_of_supply", data.state?.name, {
            shouldValidate: true,
            shouldDirty: true,
          });
          debugger
          
          if (data?.state?.code == "09") {
            setDerivedType("L");
          } else {
            setDerivedType("I");
          }
          setDerivedType(data?.state?.code=="09"?"L":"I");
          form.setValue("customer_address1", data.addressLine1, {
            shouldValidate: true,
            shouldDirty: true,
          });
          form.setValue("customer_address2", data.addressLine2, {
            shouldValidate: true,
            shouldDirty: true,
          });
          form.setValue("shipping_id", data?.shipmentAddress?.name, {
            shouldValidate: true,
            shouldDirty: true,
          });
          form.setValue("shipping_pan", data?.shipmentAddress?.Pan, {
            shouldValidate: true,
            shouldDirty: true,
          });
          form.setValue("shipping_gstin", data?.shipmentAddress?.Gstin, {
            shouldValidate: true,
            shouldDirty: true,
          });
          form.setValue("shipping_state", data?.shipmentAddress?.State?.value, {
            shouldValidate: true,
            shouldDirty: true,
          });
          form.setValue("shipping_pinCode", data?.shipmentAddress?.Pin, {
            shouldValidate: true,
            shouldDirty: true,
          });
          form.setValue("shipping_address1", data?.shipmentAddress?.Address1, {
            shouldValidate: true,
            shouldDirty: true,
          });
          form.setValue("shipping_address2", data?.shipmentAddress?.Address2, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      }
    );
  };

  useEffect(() => {
    if (Object?.keys(updateData)?.length !== 0) {
      const { channel, client, bill, ship, materials }: any = updateData;
      // Set channel value
      setChannel({
        label: channel?.channel || "",
        value: channel?.channel || "",
      });

      form.setValue("channel", channel?.channel, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("amz_fba_app", channel?.amz_fba_app, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("amz_fba_ship_id", channel?.amz_fba_ship_id, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("amz_hawb", channel?.amz_hawb, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("b2b_order_id", channel?.b2b_order_id, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("blkt_vendor_code", channel?.blkt_vendor_code, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("flk_consg_id", channel?.flk_consg_id, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("po_number", channel?.po_number, {
        shouldValidate: true,
        shouldDirty: true,
      });

      if (client?.length > 0) {
        const clientData = client[0];
        form.setValue("due_day", clientData?.soDueDate)
        form.setValue("quotation_detail", clientData?.quotation_detail)
        form.setValue("payment_term", clientData?.paymentterms)
        form.setValue("terms_condition", clientData?.terms_condition)
        setDerivedType(clientData?.clientState?.value=="09"?"L":"I");
        form.setValue("bill_name", clientData.clientname, {
          shouldValidate: true,
          shouldDirty: true,
        });
        form.setValue("customer", clientData.clientcode, {
          shouldValidate: true,
          shouldDirty: true,
        });
        dispatch(fetchClientDetails(clientData?.clientcode?.value));
        // .then((response: any) => {
        //   if (response.meta.requestStatus!=="fulfilled") {
        console.log(clientData.clientbranch)
        form.setValue("customer_branch", clientData.clientbranch?.value, {
          shouldValidate: true,
          shouldDirty: true,
        });
        //   }
        // });
        // form.setValue("bill_id", clientData.clientcode  , { shouldValidate: true, shouldDirty: true });
        form.setValue("customer", clientData.clientcode?.value, {
          shouldValidate: true,
          shouldDirty: true,
        });
        form.setValue("customer_branch", clientData.clientbranch?.value, {
          shouldValidate: true,
          shouldDirty: true,
        });
        form.setValue("customer_address1", clientData.clientaddress1, {
          shouldValidate: true,
          shouldDirty: true,
        });
        form.setValue("customer_address2", clientData.clientaddress2, {
          shouldValidate: true,
          shouldDirty: true,
        });
        form.setValue("customer_gstin", clientData.clientgst, {
          shouldValidate: true,
          shouldDirty: true,
        });
        form.setValue("place_of_supply", clientData.place_of_supply, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
      form.setValue("bill_to_label", bill?.addrbillname, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("bill_id", bill?.addrbillid, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("billing_address1", bill?.billaddress1, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("billing_address2", bill?.billaddress2, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("bill_from_gst", bill?.billgstid, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("bill_pan", bill?.billpanno, {
        shouldValidate: true,
        shouldDirty: true,
      });
      if (ship?.isSameClientAdd === "Y") {
        form.setValue("isSameClientAdd", "Y", {
          shouldValidate: true,
          shouldDirty: true,
        });
        form.setValue(
          "shipping_address1",
          form.getValues("customer_address1"),
          { shouldValidate: true, shouldDirty: true }
        );
        form.setValue(
          "shipping_address2",
          form.getValues("customer_address2"),
          { shouldValidate: true, shouldDirty: true }
        );
        form.setValue("shipping_gstin", form.getValues("customer_gstin"), {
          shouldValidate: true,
          shouldDirty: true,
        });
      } else {
        form.setValue("isSameClientAdd", "N", {
          shouldValidate: true,
          shouldDirty: true,
        });
        form.setValue("shipping_id", ship?.addrshipid, {
          shouldValidate: true,
          shouldDirty: true,
        });
        form.setValue("shipping_pan", ship?.shippanno, {
          shouldValidate: true,
          shouldDirty: true,
        });
        form.setValue("shipping_address1", ship?.shipaddress1, {
          shouldValidate: true,
          shouldDirty: true,
        });
        form.setValue("shipping_address2", ship?.shipaddress2, {
          shouldValidate: true,
          shouldDirty: true,
        });
        form.setValue("shipping_gstin", ship?.shipgstid, {
          shouldValidate: true,
          shouldDirty: true,
        });
        form.setValue("shipping_pinCode", ship?.pin, {
          shouldValidate: true,
          shouldDirty: true,
        });
        form.setValue("shipping_state", ship?.state?.value, {
          shouldValidate: true,
          shouldDirty: true,
        });
        if (ship?.state?.value == "09") {
          setDerivedType("L");
        } else {
          setDerivedType("I");
        }
      }

      const updatedData: RowData[] = materials?.map((material: any) => ({
        type: material.so_type?.value || "product",
        items: material.item_code || "",
        material: material.selectedItem[0] || "",
        materialDescription: material.item_details || "",
        rate: parseFloat(material.rate) || 0,
        orderQty: material.orderqty || 1,
        currency: material.currency || "364907247",
        gstType: material.gsttype?.[0]?.id || "I",
        localValue: material.exchangetaxablevalue,
        foreignValue: parseFloat(material.exchangerate) || 0,
        cgst: parseFloat(material.cgst) || 0,
        sgst: parseFloat(material.sgst) || 0,
        igst: parseFloat(material.igst) || 0,
        dueDate: material.due_date || "",
        hsnCode: material.hsncode || "",
        remark: material.remark || "",
        gstRate: material?.gst_rate || 0,
        updateid: material?.updateid || 0,
        isNew: true,
      }));
      setRowData(updatedData);
    }
  }, [updateData, form]);
console.log(derivedType,"derivedType")
  useEffect(() => {
    if (pathname?.includes("update") && params?.id) {
      const soId = (params.id as string).replace(/_/g, "/");
      dispatch(fetchDataForUpdate({ clientCode: soId }));
    }
  }, [pathname, params]);

  useEffect(() => {
    channel?.value &&
      form.setValue("channel", channel?.value as ChannelType, {
        shouldValidate: true,
        shouldDirty: true,
      });
    if (channel?.value) {
      dispatch(fetchClient({ clientCode: channel.value }));
    }
  }, [channel]);

  useEffect(() => {
    dispatch(fetchBillingAddressList({ search: "" }));
    dispatch(fetchCountries());
    dispatch(fetchStates());
    dispatch(fetchcurrency());
    dispatch(fetchchannelList());
  }, []);

  return (
    <div>
      <Tabs value={tabvalue} onValueChange={setTabvalue}>
        <TabsContent value="create" className="p-0 m-0">
          <CreateSalesOrder
            setTab={setTabvalue}
            setPayloadData={setPayloadData}
            channel={channel}
            setChannel={setChannel}
            data={data}
            form={form}
            handleClientChange={handleClientChange}
            setDerivedType={setDerivedType}
            setRowData={setRowData}
          />
        </TabsContent>
        <TabsContent value="add" className="p-0 m-0">
          <AddSalesOrder
            setTab={setTabvalue}
            payloadData={payloadData}
            form={form}
            rowData={rowData}
            setRowData={setRowData}
            derivedType={derivedType}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreateSalesOrderPage;
