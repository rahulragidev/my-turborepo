"use client"

import ButtonWithFeedback from "components/button-with-feedback"
import CustomAlertDialog from "components/layouts/CustomAlertDialog"
import * as AlertDialog from "components/primitives/alert-dialog"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useFormState } from "react-dom"
import toast from "react-hot-toast"
import { Site } from "types/generated/types"
import * as actions from "../../../../../server/actions"

interface Props {
    site: Site
}

const DangerSection = ({ site }: Props) => {
    const router = useRouter()
    const [state, deleteSite] = useFormState(
        actions.deleteSite.bind(null, site),
        null
    )

    useEffect(() => {
        if (state === null) return

        if (!state.success) {
            toast.error(state.message)
        } else {
            toast.success(state.message)
            router.push("/sites")
        }
    }, [state, router])

    return (
        <form className="py-8 px-8 pt-4 space-y-4 w-full rounded-xl bg-slate-900">
            <h2 className="text-2xl">Delete Site</h2>
            <p className="mb-8 max-w-xl text-red-500">
                Warning: This action cannot be undone. This will delete the site
                and all it&apos;s pages and data.
            </p>

            <CustomAlertDialog
                triggerButton={
                    <button
                        type="button"
                        className="self-end place-self-end button danger">
                        Delete Site
                    </button>
                }>
                <AlertDialog.Title className="text-lg font-semibold tracking-tight text-slate-100">
                    Are you sure you want to delete this site?
                </AlertDialog.Title>
                <AlertDialog.Description className="text-base text-slate-600">
                    All pages and data will be deleted. This action cannot be
                    undone.
                </AlertDialog.Description>
                <form
                    action={deleteSite}
                    className="flex justify-end mt-8 mb-2 space-x-4">
                    <AlertDialog.Cancel>
                        <button type="button" className="button text">
                            Cancel
                        </button>
                    </AlertDialog.Cancel>
                    <ButtonWithFeedback type="submit" variant="danger">
                        Yes, Delete
                    </ButtonWithFeedback>
                </form>
            </CustomAlertDialog>
        </form>
    )
}

export default DangerSection
