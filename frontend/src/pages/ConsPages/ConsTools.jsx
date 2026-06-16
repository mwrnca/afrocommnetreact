import { useState } from "react"
import "./Dash.css"
import Calculator from "../../components/ToolsComponents.jsx/Calculator"
import ROIcalc from "../../components/ToolsComponents.jsx/ROIcalc"
import RiskRewardCalculator from "../../components/ToolsComponents.jsx/RiskRewardCalculator"
import SimpleInterestCalculator from "../../components/ToolsComponents.jsx/SimpleInterestCalculator"
import CompoundInterestCalculator from "../../components/ToolsComponents.jsx/CompoundInterestCalculator"

export default function ConsTools() {

    const [ open, setOpen ] = useState(false);

    const [ activeForm, setActiveForm ] = useState(false);

    return (
        <section className="tools-page-container">

            <div className="tools-cont">
                <div className="tool-btn-cont">
                    <div onClick={() => setActiveForm("Calculator")}>Calculator</div>
                    <div onClick={() => setActiveForm("ROIcalc")}>ROI calc</div>
                    <div onClick={() => setActiveForm("RiskRewardCalculator")}>RiskRewardCalculato</div>
                    <div onClick={() => setActiveForm("SimpleInterestCalculator")}>SimpleInterestCalculator</div>
                    <div onClick={() => setActiveForm("CompoundInterestCalculator")}>CompoundInterestCalculator</div>
                </div>
        
                    {activeForm === "Calculator" && <Calculator />}
                    {activeForm === "ROIcalc" && <ROIcalc />}
                    {activeForm === "RiskRewardCalculator" && <RiskRewardCalculator />}
                    {activeForm === "SimpleInterestCalculator" && <SimpleInterestCalculator />}
                    {activeForm === "CompoundInterestCalculator" && <CompoundInterestCalculator/>}
            </div>

        </section>
    )
}