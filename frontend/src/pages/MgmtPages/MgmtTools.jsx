import { useState } from "react"
import "./Dash.css"
import Calculator from "../../components/ToolsComponents.jsx/Calculator"
import ROIcalc from "../../components/ToolsComponents.jsx/ROIcalc"
import BusinessNetWorthCalculator from "../../components/ToolsComponents.jsx/BusinessNetWorthCalculator"
import RiskRewardCalculator from "../../components/ToolsComponents.jsx/RiskRewardCalculator"
import SimpleInterestCalculator from "../../components/ToolsComponents.jsx/SimpleInterestCalculator"
import CompoundInterestCalculator from "../../components/ToolsComponents.jsx/CompoundInterestCalculator"
import MarketCapCalculator from "../../components/ToolsComponents.jsx/MarketCapCalculator"
import UpdateDataForm from "../../components/ToolsComponents.jsx/UpdateDataForm"


export default function MgmtTools() {

    const [ open, setOpen ] = useState(false);

    const [ activeForm, setActiveForm ] = useState(false);

    return (
        <section className="tools-page-container">

            <div className="update-data-forms">
                <UpdateDataForm />
            </div>

            <div className="tools-cont">
                <div className="tool-btn-cont">
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