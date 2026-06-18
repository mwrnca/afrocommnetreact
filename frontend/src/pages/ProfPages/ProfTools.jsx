import { useState } from "react"
import "./Dash.css"
import Calculator from "./ProfComponents/Tools/Calculator"
import ROIcalc from "./ProfComponents/Tools/ROIcalc"
import BusinessNetWorthCalculator from "./ProfComponents/Tools/BusinessNetWorthCalculator"
import RiskRewardCalculator from "./ProfComponents/Tools/RiskRewardCalculator"
import SimpleInterestCalculator from "./ProfComponents/Tools/SimpleInterestCalculator"
import CompoundInterestCalculator from "./ProfComponents/Tools/CompoundInterestCalculator"
import MarketCapCalculator from "./ProfComponents/Tools/MarketCapCalculator"
import UpdateDataForm from "./ProfComponents/Tools/UpdateDataForm"

export default function ProfTools() {

    const [ open, setOpen ] = useState(false);

    const [ activeForm, setActiveForm ] = useState(false);

    return (
        <section className="bss-tools-page-container">

            <div className="update-data-forms">
                <UpdateDataForm />
            </div>

            <div className="bss-tools-cont">
                <div className="bss-tool-btn-cont">
                    <div onClick={() => setActiveForm("Calculator")}>Calculator</div>
                    <div onClick={() => setActiveForm("ROIcalc")}>ROI calc</div>
                    <div onClick={() => setActiveForm("BusinessNetWorthCalculator")}>BusinessNetWorthCalculator</div>
                    <div onClick={() => setActiveForm("RiskRewardCalculator")}>RiskRewardCalculato</div>
                    <div onClick={() => setActiveForm("SimpleInterestCalculator")}>SimpleInterestCalculator</div>
                    <div onClick={() => setActiveForm("CompoundInterestCalculator")}>CompoundInterestCalculator</div>
                    <div onClick={() => setActiveForm("MarketCapCalculator")}>MarketCapCalculator</div>
                </div>
        
                    {activeForm === "Calculator" && <Calculator />}
                    {activeForm === "ROIcalc" && <ROIcalc />}
                    {activeForm === "BusinessNetWorthCalculator" && <BusinessNetWorthCalculator />}
                    {activeForm === "RiskRewardCalculator" && <RiskRewardCalculator />}
                    {activeForm === "SimpleInterestCalculator" && <SimpleInterestCalculator />}
                    {activeForm === "CompoundInterestCalculator" && <CompoundInterestCalculator/>}
                    {activeForm === "MarketCapCalculator" && <MarketCapCalculator />}
            </div>

        </section>
    )
}