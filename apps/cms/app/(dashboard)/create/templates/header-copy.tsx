"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Template } from "types/generated/types"

const HeaderCopy = ({ templates }: { templates: Template[] }) => {
    const searchParams = useSearchParams()
    const templateId = searchParams?.get("templateId") ?? ""

    const [selectedTemplate, setSelectedTemplate] = useState("")

    useEffect(() => {
        if (templateId && templates) {
            const selectedTemplate = templates.filter(
                template => template.id === templateId
            )
            setSelectedTemplate(selectedTemplate[0]!.name)
        }
    }, [templateId, templates])

    return (
        <div className="text-xl font-medium">
            <h2 className="text-4xl font-bold">
                {selectedTemplate ? "Great choice!" : "Choose a template"}
            </h2>
            {selectedTemplate ? (
                <p>
                    You&apos;ve selected <strong>{selectedTemplate}</strong>{" "}
                </p>
            ) : (
                <p>
                    Templates are pre-built websites. Your audience will see
                    this when they visit your site.
                </p>
            )}
        </div>
    )
}

export default HeaderCopy
