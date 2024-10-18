import { utils, writeFileXLSX } from "xlsx";


export default function SaveFileOnDisk(data: any[], guides?: any[]) {
    const wb = utils.book_new();
    const ws = utils.json_to_sheet(data);
    utils.book_append_sheet(wb, ws, "Template");
    guides?.forEach((guide, index) => {
        let nn = utils.json_to_sheet(guide)
        utils.book_append_sheet(wb, nn, `Sheet${index + 1}`);
    })
    writeFileXLSX(wb, `file`);

}
