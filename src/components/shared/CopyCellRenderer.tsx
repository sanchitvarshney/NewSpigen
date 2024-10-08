import { toast } from "@/components/ui/use-toast";
import { CopyIcon } from "lucide-react";
import { Tooltip } from "antd"; // Import Tooltip
import styled from "styled-components";

const CopyCellWrapper = styled.div`
  display: flex;
  align-items: center;
  max-width: 100%; /* Ensure it respects the parent container width */
`;

const TextWithEllipsis = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 100%; /* Adjust as needed */
  display: inline-block; /* Ensure it respects max-width */
`;

const CopyCellRenderer = (params: any) => {
  const copyToClipboard = (value: any) => {
    navigator.clipboard.writeText(value).then(() => {
      toast({
        title: "Copied to clipboard: " + value,
        className: "bg-blue-600 text-white items-center",
      });
    });
  };

  return (
    <CopyCellWrapper>
      <TextWithEllipsis title={params.value}>{params.value}</TextWithEllipsis>
      <Tooltip title={params.value} placement="top">
        <CopyIcon
          onClick={() => copyToClipboard(params.value)}
          style={{
            cursor: "pointer",
            marginLeft: "10px",
            width: "20px",
            height: "20px",
          }}
        />
      </Tooltip>
    </CopyCellWrapper>
  );
};

export default CopyCellRenderer;
