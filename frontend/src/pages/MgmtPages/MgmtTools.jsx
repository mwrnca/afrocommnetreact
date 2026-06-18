import { useState } from "react"
import "./Dash.css"
import Calculator from "./MgmtComponents/Tools/Calculator"
import ROIcalc from "./MgmtComponents/Tools/ROIcalc"
import BusinessNetWorthCalculator from "./MgmtComponents/Tools/BusinessNetWorthCalculator"
import RiskRewardCalculator from "./MgmtComponents/Tools/RiskRewardCalculator"
import SimpleInterestCalculator from "./MgmtComponents/Tools/SimpleInterestCalculator"
import CompoundInterestCalculator from "./MgmtComponents/Tools/CompoundInterestCalculator"
import MarketCapCalculator from "./MgmtComponents/Tools/MarketCapCalculator"
import UpdateDataForm from "./MgmtComponents/Tools/UpdateDataForm"


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