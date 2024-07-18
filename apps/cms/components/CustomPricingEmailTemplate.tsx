const CustomPricingEmailTemplate = ({ name }: { name: string }) => (
	<div>
		<h1>Hello, {name} !</h1>
		<p className="text-lg">
			I&apos;m so glad you&apos;ve reached out to us! My name is Praneeth and
			I&apos;m the founder of lokus.io. What range of you page views are you looking
			to buy the product for?
		</p>
		<p className="text-lg">I&apos;m looking forward to hearing from you!</p>
		<p>
			Best,
			<br />
			Praneeth
		</p>
	</div>
)

export default CustomPricingEmailTemplate
