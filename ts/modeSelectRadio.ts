const modeRadioGroup = document.querySelector<HTMLDivElement>("#modeRadioGroup")!;
const infoArea = document.querySelector<HTMLDivElement>("#infoArea")!;

const areas: Array<{input: HTMLInputElement, area: HTMLDivElement}> =
[
    { input: modeRadioGroup.querySelector<HTMLInputElement>("#force")!, area: infoArea.querySelector<HTMLDivElement>("#force")! },
    { input: modeRadioGroup.querySelector<HTMLInputElement>("#edit")!, area: infoArea.querySelector<HTMLDivElement>("#edit")! },
    { input: modeRadioGroup.querySelector<HTMLInputElement>("#config")!, area: infoArea.querySelector<HTMLDivElement>("#config")! },
];

SetNewMode();

modeRadioGroup.addEventListener("change", (e) =>
{
    SetNewMode();
});

function SetNewMode()
{
    //const newMode = modeRadioGroup.querySelector<HTMLInputElement>("input[name=modeSelect]:checked")!.value;
    
    areas.forEach((pair) => pair.area.hidden = !pair.input.checked);
}