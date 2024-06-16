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
            fetch("force.html")
                .then((response) => response.text())
                .then((html) => infoArea.innerHTML = html);
            break;
        case "edit":
            fetch("edit.html")
                .then((response) => response.text())
                .then((html) => infoArea.innerHTML = html);
            break;
        case "config":
            fetch("config.html")
                .then((response) => response.text())
                .then((html) => infoArea.innerHTML = html);
            break;
        default:
            throw new Error("unknown mode!");
    }
});