import Button from "components/Button"

const PageActionButton = ({
	hasActiveSubscription,
	isSiteLaunched,
	changesDetected,
	handleSubscribeClick,
	handleLaunchClick,
	handlePublishClick,
}: {
	hasActiveSubscription: boolean
	isSiteLaunched: boolean
	changesDetected: boolean
	handleSubscribeClick: () => void
	handleLaunchClick: () => void
	handlePublishClick: () => void
}) => {
	if (!hasActiveSubscription) {
		return <Button onClick={() => handleSubscribeClick()}>Subscribe</Button>
	}

	if (hasActiveSubscription && !isSiteLaunched) {
		return <Button onClick={() => handleLaunchClick()}>Launch</Button>
	}

	if (hasActiveSubscription && isSiteLaunched && changesDetected) {
		return <Button onClick={() => handlePublishClick()}>Publish</Button>
	}

	// If the user has an active subscription, the site is launched, and no changes are detected, return null to render nothing.
	return null
}

export default PageActionButton
