const modeRadioGroup = document.querySelector<HTMLInputElement>("#modeRadioGroup");
const infoArea = document.querySelector<HTMLDivElement>("#infoArea");

if(!modeRadioGroup) throw new Error("Radio group not found!");
if(!infoArea) throw new Error("Info area not found!");

modeRadioGroup.addEventListener("change", (e) =>
{
    const newMode = modeRadioGroup.querySelector<HTMLInputElement>("input[name=modeSelect]:checked")?.value;

    switch(newMode)
    {
        case "force":
            break;
        case "edit":
            break;
        case "config":
            break;
        default:
            throw new Error("unknown mode!");
    }
});