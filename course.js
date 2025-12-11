// Navigation toggle
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        const expanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', String(!expanded));
        navLinks.classList.toggle('active');
    });
}

// Course data
const courseData = {
    'recycling-basics': {
        title: 'Recycling Basics',
        description: 'Master the fundamentals of recycling and become a waste reduction expert',
        lessons: [
            {
                title: 'Introduction to Recycling',
                content: `
                    <h2>Welcome to Recycling Basics</h2>
                    <p>Recycling is one of the most important things we can do to protect our environment. Every year, millions of tons of waste end up in landfills that could have been recycled instead.</p>
                    <img src="https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Recycling symbols" class="lesson-image">
                    <h3>Why Recycling Matters</h3>
                    <p>Recycling helps us:</p>
                    <ul>
                        <li>Conserve natural resources like timber, water, and minerals</li>
                        <li>Reduce greenhouse gas emissions</li>
                        <li>Save energy compared to producing new products</li>
                        <li>Reduce the amount of waste in landfills</li>
                        <li>Create jobs in the recycling and manufacturing industries</li>
                    </ul>
                    <div class="tip-box">
                        <h4>Did you know?</h4>
                        <p>Recycling one aluminum can saves enough energy to power a TV for 3 hours!</p>
                    </div>
                `
            },
            {
                title: 'Understanding Recycling Symbols',
                content: `
                    <h2>Recycling Symbols & Numbers</h2>
                    <p>The recycling symbol with numbers 1-7 tells you what type of plastic an item is made from. Understanding these symbols is crucial for proper recycling.</p>
                    <h3>The Plastic Identification Codes</h3>
                    <ul>
                        <li><strong>1 (PET/PETE):</strong> Water bottles, food containers, clothing fibers</li>
                        <li><strong>2 (HDPE):</strong> Milk jugs, shampoo bottles, detergent containers</li>
                        <li><strong>3 (PVC):</strong> Pipes, some food wrapping, medical equipment</li>
                        <li><strong>4 (LDPE):</strong> Shopping bags, bread bags, squeezable bottles</li>
                        <li><strong>5 (PP):</strong> Yogurt containers, bottle caps, straws</li>
                        <li><strong>6 (PS):</strong> Disposable cups, takeout containers, packaging foam</li>
                        <li><strong>7 (Other):</strong> Mixed plastics, often difficult to recycle</li>
                    </ul>
                    <div class="tip-box">
                        <h4>Pro Tip</h4>
                        <p>Numbers 1, 2, and 5 are most commonly accepted by recycling programs. Check with your local facility for specific guidelines.</p>
                    </div>
                `
            },
            {
                title: 'Proper Cleaning & Preparation',
                content: `
                    <h2>Clean Before You Recycle</h2>
                    <p>Contaminated recyclables can ruin entire batches, making them unsuitable for processing. Here's how to properly prepare items for recycling:</p>
                    <h3>Step-by-Step Cleaning Process</h3>
                    <ul>
                        <li><strong>Empty completely:</strong> Remove all contents, including lids and caps</li>
                        <li><strong>Rinse with water:</strong> Remove food residue and liquids</li>
                        <li><strong>Remove labels:</strong> When possible, peel off adhesive labels</li>
                        <li><strong>Separate materials:</strong> Don't mix different types of recyclables</li>
                        <li><strong>Let air dry:</strong> Ensure items are dry before placing in recycling bin</li>
                    </ul>
                    <h3>Special Considerations</h3>
                    <p>Some items require extra attention:</p>
                    <ul>
                        <li>Pizza boxes: Remove any food residue; greasy parts go to compost</li>
                        <li>Glass jars: Remove metal lids and rings</li>
                        <li>Aerosol cans: Must be completely empty</li>
                    </ul>
                    <div class="tip-box">
                        <h4>Quick Cleaning Tip</h4>
                        <p>A quick rinse is enough - don't waste water trying to make containers spotless!</p>
                    </div>
                `
            },
            {
                title: 'Common Mistakes to Avoid',
                content: `
                    <h2>Recycling Don'ts</h2>
                    <p>Avoid these common recycling mistakes that can contaminate entire loads and cause problems at recycling facilities:</p>
                    <h3>Major Recycling No-Nos</h3>
                    <ul>
                        <li><strong>Don't bag recyclables:</strong> Plastic bags jam sorting machinery</li>
                        <li><strong>Don't mix materials:</strong> Keep paper, plastic, glass, and metal separate</li>
                        <li><strong>Don't include food waste:</strong> Leftover food attracts pests and creates odors</li>
                        <li><strong>Don't include liquids:</strong> Empty all containers completely</li>
                        <li><strong>Don't "wish-cycle":</strong> Only include items you know are recyclable</li>
                    </ul>
                    <h3>Items That Don't Belong</h3>
                    <p>These items should never go in your recycling bin:</p>
                    <ul>
                        <li>Plastic bags and film (take to special drop-off locations)</li>
                        <li>Broken glass or ceramics</li>
                        <li>Electronics (require special e-waste recycling)</li>
                        <li>Hazardous materials (paint, batteries, chemicals)</li>
                        <li>Textiles and clothing</li>
                    </ul>
                    <div class="tip-box">
                        <h4>Remember</h4>
                        <p>When in doubt, throw it out! It's better to put questionable items in the trash than contaminate recycling.</p>
                    </div>
                `
            },
            {
                title: 'Take Action: Your Recycling Plan',
                content: `
                    <h2>Create Your Personal Recycling System</h2>
                    <p>Now that you understand the basics, let's create a sustainable recycling plan for your home that you can actually stick to.</p>
                    <h3>Setting Up Your System</h3>
                    <ul>
                        <li><strong>Designate recycling areas:</strong> Set up separate bins for different materials</li>
                        <li><strong>Learn local guidelines:</strong> Contact your waste management company for specific rules</li>
                        <li><strong>Create cleaning stations:</strong> Keep cleaning supplies near your recycling area</li>
                        <li><strong>Establish routines:</strong> Set specific days for cleaning and sorting</li>
                        <li><strong>Educate your household:</strong> Make sure everyone knows the rules</li>
                    </ul>
                    <h3>Tracking Your Progress</h3>
                    <p>Monitor your recycling success with these methods:</p>
                    <ul>
                        <li>Keep a weekly log of what you recycle vs. throw away</li>
                        <li>Weigh your recycling to see improvements over time</li>
                        <li>Take photos of your organized recycling system</li>
                        <li>Set monthly goals for reducing waste</li>
                    </ul>
                    <div class="tip-box">
                        <h4>30-Day Challenge</h4>
                        <p>Try to increase your recycling rate by 25% this month. Track your progress daily and celebrate your wins!</p>
                    </div>
                    <h3>Congratulations!</h3>
                    <p>You've completed the Recycling Basics course! You're now equipped with the knowledge to make a real difference in waste reduction. Remember, every item you recycle properly contributes to a more sustainable future.</p>
                `
            }
        ]
    },
    'ewaste-management': {
        title: 'E-Waste Management',
        description: 'Learn to handle electronic waste responsibly and safely',
        lessons: [
            {
                title: 'Understanding E-Waste',
                content: `
                    <h2>What is E-Waste?</h2>
                    <p>Electronic waste (e-waste) includes any electronic device that's no longer wanted, working, or has reached the end of its useful life. This includes everything from smartphones to large appliances.</p>
                    <img src="https://images.pexels.com/photos/9324336/pexels-photo-9324336.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Electronic waste" class="lesson-image">
                    <h3>Types of E-Waste</h3>
                    <ul>
                        <li><strong>Small equipment:</strong> Phones, tablets, cameras, small kitchen appliances</li>
                        <li><strong>Large equipment:</strong> Refrigerators, washing machines, air conditioners</li>
                        <li><strong>IT equipment:</strong> Computers, laptops, printers, monitors</li>
                        <li><strong>Consumer electronics:</strong> TVs, radios, gaming consoles</li>
                        <li><strong>Lighting:</strong> LED bulbs, fluorescent tubes</li>
                    </ul>
                    <div class="tip-box">
                        <h4>Shocking Fact</h4>
                        <p>50 million tons of e-waste are generated globally each year - that's like throwing away 1000 laptops every second!</p>
                    </div>
                `
            },
            {
                title: 'Why E-Waste Matters',
                content: `
                    <h2>The Hidden Dangers and Opportunities</h2>
                    <p>E-waste is both a serious environmental threat and a valuable resource. Understanding both sides is crucial for proper management.</p>
                    <h3>Valuable Materials in E-Waste</h3>
                    <ul>
                        <li><strong>Precious metals:</strong> Gold, silver, platinum, palladium</li>
                        <li><strong>Base metals:</strong> Copper, aluminum, steel, zinc</li>
                        <li><strong>Rare earth elements:</strong> Neodymium, dysprosium, terbium</li>
                        <li><strong>Other materials:</strong> Plastics, glass, ceramics</li>
                    </ul>
                    <h3>Toxic Substances</h3>
                    <p>E-waste also contains harmful materials that must be handled carefully:</p>
                    <ul>
                        <li><strong>Heavy metals:</strong> Lead, mercury, cadmium, chromium</li>
                        <li><strong>Flame retardants:</strong> PBDEs and other brominated compounds</li>
                        <li><strong>Refrigerants:</strong> CFCs and HCFCs in cooling equipment</li>
                        <li><strong>Other toxins:</strong> Beryllium, arsenic, antimony</li>
                    </ul>
                    <div class="tip-box">
                        <h4>Environmental Impact</h4>
                        <p>When improperly disposed of, these toxic materials can leak into soil and groundwater, causing serious environmental and health problems for decades.</p>
                    </div>
                `
            },
            {
                title: 'Data Security First',
                content: `
                    <h2>Protecting Your Personal Information</h2>
                    <p>Before disposing of any electronic device, ensuring your personal data is completely and securely removed should be your top priority.</p>
                    <h3>Data Removal Steps</h3>
                    <ul>
                        <li><strong>Back up important files:</strong> Transfer photos, documents, and other valuable data</li>
                        <li><strong>Sign out of all accounts:</strong> Deactivate cloud services, email, social media</li>
                        <li><strong>Perform factory reset:</strong> Use device settings to reset to original state</li>
                        <li><strong>Remove storage devices:</strong> Take out hard drives, SIM cards, memory cards</li>
                        <li><strong>Use data wiping software:</strong> For sensitive devices, use specialized software</li>
                    </ul>
                    <h3>Advanced Security Measures</h3>
                    <p>For devices that contained sensitive information:</p>
                    <ul>
                        <li>Use Department of Defense (DoD) level data wiping standards</li>
                        <li>Consider physical destruction of hard drives</li>
                        <li>Get certificates of data destruction from professional services</li>
                        <li>Remove and destroy SSD storage chips if necessary</li>
                    </ul>
                    <div class="tip-box">
                        <h4>Critical Warning</h4>
                        <p>Simply deleting files or formatting drives isn't enough - data can still be recovered. Always use proper data wiping methods!</p>
                    </div>
                `
            },
            {
                title: 'Proper Disposal Methods',
                content: `
                    <h2>Where to Take E-Waste</h2>
                    <p>Never throw e-waste in regular trash. Instead, use these certified and safe disposal options that ensure proper recycling and environmental protection.</p>
                    <h3>Disposal Options</h3>
                    <ul>
                        <li><strong>Manufacturer takeback programs:</strong> Apple, Dell, HP, and other brands accept their products</li>
                        <li><strong>Retailer programs:</strong> Best Buy, Staples, Office Depot accept various electronics</li>
                        <li><strong>Municipal collection events:</strong> Check your city's website for scheduled e-waste events</li>
                        <li><strong>Certified recyclers:</strong> Look for R2 (Responsible Recycling) or e-Stewards certification</li>
                        <li><strong>Special programs:</strong> Call2Recycle for batteries, EPA partnerships for certain items</li>
                    </ul>
                    <h3>What to Look For</h3>
                    <p>When choosing an e-waste recycler, ensure they:</p>
                    <ul>
                        <li>Have proper certifications (R2 or e-Stewards)</li>
                        <li>Provide certificates of recycling</li>
                        <li>Follow data destruction protocols</li>
                        <li>Don't export waste to developing countries</li>
                        <li>Have transparent recycling processes</li>
                    </ul>
                    <div class="tip-box">
                        <h4>Red Flags</h4>
                        <p>Avoid recyclers who won't provide documentation, seem unprofessional, or offer to pay cash for your e-waste without credentials.</p>
                    </div>
                `
            },
            {
                title: 'Reduce and Reuse First',
                content: `
                    <h2>Before Disposal: Extend Device Life</h2>
                    <p>The most environmentally friendly device is the one you already own. Before recycling, consider these alternatives that can extend device life and reduce waste.</p>
                    <h3>Repair and Upgrade Options</h3>
                    <ul>
                        <li><strong>Professional repair:</strong> Many devices can be fixed for less than replacement cost</li>
                        <li><strong>DIY fixes:</strong> YouTube tutorials for common problems like screen replacement</li>
                        <li><strong>Hardware upgrades:</strong> Add memory (RAM) or storage (SSD) to improve performance</li>
                        <li><strong>Software optimization:</strong> Clean up files, update software, remove bloatware</li>
                        <li><strong>Battery replacement:</strong> Often extends device life significantly</li>
                    </ul>
                    <h3>Give Devices New Life</h3>
                    <ul>
                        <li><strong>Donate to schools:</strong> Educational institutions often need older computers</li>
                        <li><strong>Community centers:</strong> Nonprofit organizations may use your devices</li>
                        <li><strong>Senior centers:</strong> Older adults may benefit from simpler devices</li>
                        <li><strong>Sell or trade:</strong> Even broken devices have value for parts</li>
                        <li><strong>Repurpose creatively:</strong> Old tablets make great digital photo frames or kitchen timers</li>
                    </ul>
                    <div class="tip-box">
                        <h4>Golden Rule</h4>
                        <p>Remember: The most eco-friendly device is the one you already own! Before buying new, always ask if repair, upgrade, or reuse is possible.</p>
                    </div>
                    <h3>Course Complete!</h3>
                    <p>You now have the knowledge to handle e-waste responsibly, protect your data, and make environmentally conscious decisions about electronic devices. Every device you keep out of landfills makes a difference!</p>
                `
            }
        ]
    },
    'composting': {
        title: 'Composting',
        description: 'Transform organic waste into rich soil amendment',
        lessons: [
            {
                title: 'Introduction to Composting',
                content: `
                    <h2>What is Composting?</h2>
                    <p>Composting is nature's way of recycling organic matter. It's the controlled process of breaking down organic materials like food scraps and yard waste into nutrient-rich soil amendment called humus.</p>
                    <img src="https://images.pexels.com/photos/4505171/pexels-photo-4505171.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Compost pile" class="lesson-image">
                    <h3>Benefits of Composting</h3>
                    <ul>
                        <li><strong>Reduces waste:</strong> Diverts organic matter from landfills</li>
                        <li><strong>Improves soil:</strong> Adds nutrients and improves soil structure</li>
                        <li><strong>Saves money:</strong> Reduces need for commercial fertilizers</li>
                        <li><strong>Reduces methane:</strong> Prevents greenhouse gas emissions from landfills</li>
                        <li><strong>Conserves water:</strong> Compost helps soil retain moisture</li>
                    </ul>
                    <div class="tip-box">
                        <h4>Amazing Fact</h4>
                        <p>Food waste makes up about 30% of household garbage, but 100% of it can be composted!</p>
                    </div>
                `
            },
            {
                title: 'Green vs Brown Materials',
                content: `
                    <h2>Understanding Compost Ingredients</h2>
                    <p>Successful composting requires a balance of "green" nitrogen-rich materials and "brown" carbon-rich materials. Think of it like cooking - you need the right recipe!</p>
                    <h3>Green Materials (Nitrogen-Rich)</h3>
                    <ul>
                        <li><strong>Kitchen scraps:</strong> Fruit and vegetable peels, coffee grounds, tea bags</li>
                        <li><strong>Fresh yard waste:</strong> Grass clippings, fresh leaves, garden trimmings</li>
                        <li><strong>Other organics:</strong> Eggshells, nut shells (crushed), fresh flowers</li>
                    </ul>
                    <h3>Brown Materials (Carbon-Rich)</h3>
                    <ul>
                        <li><strong>Dry yard waste:</strong> Fallen leaves, small twigs, pine needles</li>
                        <li><strong>Paper products:</strong> Shredded newspaper, cardboard, paper towels</li>
                        <li><strong>Other materials:</strong> Sawdust, straw, dryer lint (cotton only)</li>
                    </ul>
                    <h3>The Golden Ratio</h3>
                    <p>Aim for about 3:1 ratio of browns to greens by volume. This provides:</p>
                    <ul>
                        <li>Proper carbon-to-nitrogen balance for decomposition</li>
                        <li>Good air circulation and drainage</li>
                        <li>Prevention of odors and pest problems</li>
                    </ul>
                    <div class="tip-box">
                        <h4>Quick Fix Guide</h4>
                        <p>Too smelly? Add more browns. Too slow? Add more greens and turn more often.</p>
                    </div>
                `
            },
            {
                title: 'Setting Up Your Compost',
                content: `
                    <h2>Choosing Your Composting Method</h2>
                    <p>Different composting methods work for different living situations, space constraints, and personal preferences. Find the one that fits your lifestyle!</p>
                    <h3>Outdoor Composting Methods</h3>
                    <ul>
                        <li><strong>Basic pile:</strong> Simply pile materials in a corner of your yard</li>
                        <li><strong>Wire bin:</strong> Use wire fencing to create a circular bin</li>
                        <li><strong>Wooden bin system:</strong> Build or buy a three-bin system for continuous composting</li>
                        <li><strong>Tumbler:</strong> Enclosed drum that rotates for faster decomposition</li>
                    </ul>
                    <h3>Indoor/Small Space Options</h3>
                    <ul>
                        <li><strong>Worm composting (vermicomposting):</strong> Use worms in a special bin</li>
                        <li><strong>Bokashi composting:</strong> Fermentation method using special bran</li>
                        <li><strong>Electric composters:</strong> Countertop devices that speed up the process</li>
                        <li><strong>Compost collection:</strong> Collect scraps for community composting programs</li>
                    </ul>
                    <h3>Choosing Your Location</h3>
                    <p>For outdoor composting, choose a spot that is:</p>
                    <ul>
                        <li>Partially shaded to prevent drying out</li>
                        <li>Well-drained to avoid waterlogging</li>
                        <li>Easily accessible year-round</li>
                        <li>Near a water source for moisture control</li>
                    </ul>
                    <div class="tip-box">
                        <h4>Beginner Tip</h4>
                        <p>Start small! A 3x3 foot pile or a single tumbler is perfect for learning the basics.</p>
                    </div>
                `
            },
            {
                title: 'Maintaining Your Compost',
                content: `
                    <h2>The Four Essentials of Composting</h2>
                    <p>Your compost pile is like a living ecosystem. It needs four key elements to work properly and efficiently transform your organic waste into rich compost.</p>
                    <h3>1. Air (Oxygen)</h3>
                    <ul>
                        <li><strong>Why it matters:</strong> Aerobic bacteria work faster and don't create odors</li>
                        <li><strong>How to provide it:</strong> Turn your pile every 2-4 weeks</li>
                        <li><strong>Signs of poor aeration:</strong> Bad smells, slow decomposition</li>
                        <li><strong>Quick fix:</strong> Add more browns and turn more frequently</li>
                    </ul>
                    <h3>2. Water (Moisture)</h3>
                    <ul>
                        <li><strong>Ideal moisture:</strong> Like a wrung-out sponge (40-60%)</li>
                        <li><strong>Too dry:</strong> Decomposition stops, pile won't heat up</li>
                        <li><strong>Too wet:</strong> Creates anaerobic conditions and odors</li>
                        <li><strong>Testing:</strong> Squeeze a handful - a few drops should come out</li>
                    </ul>
                    <h3>3. Temperature</h3>
                    <ul>
                        <li><strong>Hot phase:</strong> 130-160°F kills pathogens and weed seeds</li>
                        <li><strong>Cooling phase:</strong> Allows beneficial organisms to finish the process</li>
                        <li><strong>Monitoring:</strong> Use a compost thermometer for accuracy</li>
                    </ul>
                    <h3>4. Time</h3>
                    <ul>
                        <li><strong>Active composting:</strong> 3-6 months with regular turning</li>
                        <li><strong>Passive composting:</strong> 6-12 months with minimal intervention</li>
                        <li><strong>Speed factors:</strong> Size of materials, turning frequency, weather</li>
                    </ul>
                    <div class="tip-box">
                        <h4>Health Check</h4>
                        <p>Good compost should smell earthy and sweet. If it smells sour or rotten, it needs more browns and better aeration!</p>
                    </div>
                `
            },
            {
                title: 'Using Finished Compost',
                content: `
                    <h2>Your Black Gold is Ready!</h2>
                    <p>Congratulations! Your finished compost is ready when it's dark brown or black, crumbly in texture, and has an earthy, pleasant smell. Now let's put this "black gold" to work!</p>
                    <h3>Signs Compost is Ready</h3>
                    <ul>
                        <li><strong>Appearance:</strong> Dark, crumbly, uniform texture</li>
                        <li><strong>Smell:</strong> Earthy, forest-like aroma</li>
                        <li><strong>Temperature:</strong> Cool to touch, no longer heating up</li>
                        <li><strong>Original materials:</strong> No longer recognizable</li>
                        <li><strong>Time test:</strong> Has been composting for at least 3 months</li>
                    </ul>
                    <h3>Ways to Use Your Compost</h3>
                    <ul>
                        <li><strong>Soil amendment:</strong> Mix 25-50% compost into garden beds</li>
                        <li><strong>Top dressing:</strong> Spread 1-2 inches around plants</li>
                        <li><strong>Potting mix:</strong> Blend with sand and peat for container plants</li>
                        <li><strong>Lawn fertilizer:</strong> Spread thin layer and water in</li>
                        <li><strong>Mulch alternative:</strong> Use around trees and shrubs</li>
                    </ul>
                    <h3>Application Tips</h3>
                    <ul>
                        <li>Apply compost in spring for best plant uptake</li>
                        <li>Water after applying to help nutrients reach roots</li>
                        <li>Don't over-apply - more isn't always better</li>
                        <li>Store extra compost in covered bins for later use</li>
                    </ul>
                    <div class="tip-box">
                        <h4>Sharing is Caring</h4>
                        <p>Great compost makes great gifts! Share with neighbors, friends, or local community gardens to spread the benefits.</p>
                    </div>
                    <h3>You Did It!</h3>
                    <p>You've completed the composting course and learned to transform waste into a valuable resource. You're now part of nature's recycling system! Keep composting and enjoy the benefits of richer soil, reduced waste, and a smaller environmental footprint.</p>
                `
            }
        ]
    },
    'plastic-reduction': {
        title: 'Plastic Reduction',
        description: 'Practical strategies to minimize plastic waste in daily life',
        lessons: [
            {
                title: 'The Plastic Problem',
                content: `
                    <h2>Understanding Plastic Pollution</h2>
                    <p>Plastic pollution is one of the most pressing environmental issues of our time. Understanding the scope of the problem is the first step toward making meaningful changes.</p>
                    <img src="https://images.pexels.com/photos/6962931/pexels-photo-6962931.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Plastic waste" class="lesson-image">
                    <h3>The Numbers Don't Lie</h3>
                    <ul>
                        <li><strong>Global production:</strong> 300+ million tons of plastic waste annually</li>
                        <li><strong>Recycling rate:</strong> Only 9% of all plastic ever made has been recycled</li>
                        <li><strong>Ocean impact:</strong> 8 million tons of plastic enter oceans yearly</li>
                        <li><strong>Decomposition time:</strong> Plastic bottles take 450+ years to decompose</li>
                        <li><strong>Microplastics:</strong> Found in food, water, air, and even human blood</li>
                    </ul>
                    <h3>Environmental Consequences</h3>
                    <ul>
                        <li>Marine life ingestion and entanglement</li>
                        <li>Soil and water contamination</li>
                        <li>Food chain contamination through microplastics</li>
                        <li>Greenhouse gas emissions from production and incineration</li>
                        <li>Habitat destruction and ecosystem disruption</li>
                    </ul>
                    <div class="tip-box">
                        <h4>Staggering Reality</h4>
                        <p>We produce 300 million tons of plastic waste every year - that's nearly the weight of the entire human population!</p>
                    </div>
                `
            },
            {
                title: 'Single-Use Plastic Swaps',
                content: `
                    <h2>Easy Replacements for Daily Items</h2>
                    <p>The easiest way to reduce plastic waste is to replace single-use items with reusable alternatives. These simple swaps can dramatically reduce your plastic footprint.</p>
                    <h3>Kitchen & Dining Swaps</h3>
                    <ul>
                        <li><strong>Water bottles</strong> → Stainless steel, glass, or BPA-free reusable bottles</li>
                        <li><strong>Coffee cups</strong> → Insulated travel mugs or ceramic cups</li>
                        <li><strong>Plastic straws</strong> → Metal, bamboo, glass, or silicone straws</li>
                        <li><strong>Plastic cutlery</strong> → Bamboo or metal travel utensil sets</li>
                        <li><strong>Food storage bags</strong> → Glass containers or silicone bags</li>
                        <li><strong>Plastic wrap</strong> → Beeswax wraps or glass storage containers</li>
                    </ul>
                    <h3>Shopping & Storage Swaps</h3>
                    <ul>
                        <li><strong>Plastic shopping bags</strong> → Canvas, hemp, or mesh reusable bags</li>
                        <li><strong>Produce bags</strong> → Mesh or muslin cloth bags</li>
                        <li><strong>Plastic containers</strong> → Glass jars or stainless steel containers</li>
                        <li><strong>Disposable razors</strong> → Safety razors with replaceable blades</li>
                    </ul>
                    <h3>Getting Started</h3>
                    <ul>
                        <li>Start with one swap per week to build habits gradually</li>
                        <li>Choose items you use most frequently first</li>
                        <li>Invest in quality alternatives that will last</li>
                        <li>Keep reusables easily accessible (car, purse, office)</li>
                    </ul>
                    <div class="tip-box">
                        <h4>Budget-Friendly Tip</h4>
                        <p>You don't need to buy everything new! Repurpose glass jars for storage and use old t-shirts as produce bags.</p>
                    </div>
                `
            },
            {
                title: 'Smart Shopping Strategies',
                content: `
                    <h2>Reduce Plastic at the Source</h2>
                    <p>Your shopping choices have enormous power to reduce plastic waste. By being mindful about what and how you buy, you can significantly decrease plastic consumption.</p>
                    <h3>Pre-Shopping Preparation</h3>
                    <ul>
                        <li><strong>Bring reusable bags:</strong> Keep them in your car, purse, and by the door</li>
                        <li><strong>Pack containers:</strong> For bulk items, deli counters, and takeout</li>
                        <li><strong>Make a list:</strong> Avoid impulse purchases with excessive packaging</li>
                        <li><strong>Research stores:</strong> Find bulk stores, farmers markets, and package-free options</li>
                    </ul>
                    <h3>In-Store Strategies</h3>
                    <ul>
                        <li><strong>Choose bulk options:</strong> Grains, nuts, spices, and cleaning supplies</li>
                        <li><strong>Select minimal packaging:</strong> Loose produce over pre-packaged</li>
                        <li><strong>Prefer glass or cardboard:</strong> Over plastic when given options</li>
                        <li><strong>Buy concentrated products:</strong> Less packaging per use</li>
                        <li><strong>Support eco-friendly brands:</strong> Companies committed to plastic reduction</li>
                    </ul>
                    <h3>Alternative Shopping Venues</h3>
                    <ul>
                        <li><strong>Farmers markets:</strong> Fresh produce with minimal packaging</li>
                        <li><strong>Bulk stores:</strong> Zero-waste or package-free shops</li>
                        <li><strong>Co-ops:</strong> Community-supported agriculture (CSA) programs</li>
                        <li><strong>Online alternatives:</strong> Companies specializing in plastic-free products</li>
                    </ul>
                    <div class="tip-box">
                        <h4>Pro Shopping Tip</h4>
                        <p>Many stores will let you use your own containers for bulk items and deli counters - just ask! Some even offer discounts for bringing your own bags.</p>
                    </div>
                `
            },
            {
                title: 'DIY Plastic-Free Solutions',
                content: `
                    <h2>Make Your Own Alternatives</h2>
                    <p>Creating your own plastic-free alternatives can be fun, cost-effective, and highly customizable. Plus, you know exactly what ingredients you're using!</p>
                    <h3>Kitchen Solutions</h3>
                    <ul>
                        <li><strong>Beeswax food wraps:</strong> Melt beeswax into cotton fabric for reusable wraps</li>
                        <li><strong>Glass storage system:</strong> Save and repurpose glass jars from purchases</li>
                        <li><strong>Cloth produce bags:</strong> Sew mesh or muslin bags from fabric scraps</li>
                        <li><strong>Homemade cleaning products:</strong> Vinegar, baking soda, and essential oils</li>
                    </ul>
                    <h3>Personal Care DIYs</h3>
                    <ul>
                        <li><strong>Bar soaps and shampoos:</strong> Replace liquid products in plastic bottles</li>
                        <li><strong>DIY toothpaste:</strong> Baking soda, coconut oil, and peppermint oil</li>
                        <li><strong>Reusable cotton pads:</strong> Cut and hem flannel fabric</li>
                        <li><strong>Natural deodorants:</strong> Coconut oil, baking soda, and essential oils</li>
                    </ul>
                    <h3>Household Items</h3>
                    <ul>
                        <li><strong>Cloth shopping bags:</strong> Sew durable bags from canvas or old jeans</li>
                        <li><strong>Reusable ice packs:</strong> Rice or beans in cloth bags</li>
                        <li><strong>Natural sponges:</strong> Loofah gourds or knitted dishcloths</li>
                        <li><strong>Plastic-free planters:</strong> Coconut coir pots or newspaper seedling pots</li>
                    </ul>
                    <h3>Quick DIY Projects</h3>
                    <ul>
                        <li>Transform old t-shirts into produce bags (no sewing required)</li>
                        <li>Use mason jars as drinking glasses and food storage</li>
                        <li>Make fire starters from dryer lint and cardboard tubes</li>
                        <li>Create gift wrap from newspaper, magazines, or fabric scraps</li>
                    </ul>
                    <div class="tip-box">
                        <h4>Start Simple</h4>
                        <p>Begin with easy projects like saving glass jars or making cloth bags. As you build confidence, try more complex DIY solutions!</p>
                    </div>
                `
            },
            {
                title: 'Building Long-term Habits',
                content: `
                    <h2>Making Plastic Reduction Stick</h2>
                    <p>Sustainable change happens through consistent habits, not perfect moments. Let's create a system that makes plastic-free living feel natural and achievable long-term.</p>
                    <h3>Start Small and Build</h3>
                    <ul>
                        <li><strong>One change per week:</strong> Don't overwhelm yourself with too many changes at once</li>
                        <li><strong>Focus on frequency:</strong> Target items you use most often first</li>
                        <li><strong>Celebrate small wins:</strong> Acknowledge each plastic item you avoid</li>
                        <li><strong>Learn from setbacks:</strong> Don't let one forgotten reusable bag derail progress</li>
                    </ul>
                    <h3>Create Support Systems</h3>
                    <ul>
                        <li><strong>Visual reminders:</strong> Notes on your door, car dashboard, or phone</li>
                        <li><strong>Strategic placement:</strong> Keep reusables where you'll see and use them</li>
                        <li><strong>Digital tools:</strong> Apps to track progress and set reminders</li>
                        <li><strong>Community support:</strong> Find or create a group of like-minded individuals</li>
                    </ul>
                    <h3>Track Your Impact</h3>
                    <ul>
                        <li>Count plastic items avoided each week</li>
                        <li>Take photos of your plastic-free alternatives in action</li>
                        <li>Calculate money saved from reusable items</li>
                        <li>Share progress on social media to inspire others</li>
                        <li>Keep a journal of challenges and solutions</li>
                    </ul>
                    <h3>Inspire Others</h3>
                    <ul>
                        <li><strong>Lead by example:</strong> Bring reusables without preaching</li>
                        <li><strong>Share your successes:</strong> Tell others about money saved or products you love</li>
                        <li><strong>Gift alternatives:</strong> Give reusable items as presents</li>
                        <li><strong>Educate gently:</strong> Share facts when people show interest</li>
                    </ul>
                    <div class="tip-box">
                        <h4>Remember This</h4>
                        <p>Perfect is the enemy of good. Every plastic item you avoid makes a difference - you don't have to be perfect to make an impact!</p>
                    </div>
                    <h3>You're Making a Difference!</h3>
                    <p>Congratulations on completing the Plastic Reduction course! You now have practical strategies and a sustainable mindset for reducing plastic waste. Remember, your individual actions ripple outward, inspiring others and creating demand for better alternatives. Keep going - the planet thanks you!</p>
                `
            }
        ]
    }
};

// Get course from URL parameter
function getCourseFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('course');
}

// Current course and lesson state
let currentCourse = null;
let currentLesson = 0;
let completedLessons = [];

// DOM elements
const courseTitle = document.getElementById('course-title');
const lessonContent = document.getElementById('lesson-content');
const lessonList = document.getElementById('lesson-list');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const lessonCounter = document.getElementById('lesson-counter');
const bannerText = document.getElementById('banner-text');

// Initialize course on page load
document.addEventListener('DOMContentLoaded', () => {
    const courseId = getCourseFromURL();
    if (courseId && courseData[courseId]) {
        loadCourse(courseId);
    } else {
        // Redirect to education page if no valid course
        window.location.href = 'education.html';
    }
});

function loadCourse(courseId) {
    currentCourse = courseData[courseId];
    currentLesson = 0;
    completedLessons = [];
    
    // Update page title and banner
    document.title = `${currentCourse.title} - WasteWise`;
    courseTitle.textContent = currentCourse.title;
    bannerText.textContent = currentCourse.description;
    
    // Build lesson sidebar
    buildLessonSidebar();
    
    // Load first lesson
    updateLessonContent();
    updateNavigation();
    updateProgress();
}

function buildLessonSidebar() {
    lessonList.innerHTML = '';
    currentCourse.lessons.forEach((lesson, index) => {
        const li = document.createElement('li');
        li.className = 'lesson-item';
        li.innerHTML = `
            <span class="lesson-number">Lesson ${index + 1}</span>
            <div class="lesson-title">${lesson.title}</div>
        `;
        li.addEventListener('click', () => goToLesson(index));
        lessonList.appendChild(li);
    });
}

function goToLesson(lessonIndex) {
    // Mark previous lesson as completed if moving forward
    if (lessonIndex > currentLesson && !completedLessons.includes(currentLesson)) {
        completedLessons.push(currentLesson);
    }
    
    currentLesson = lessonIndex;
    updateLessonContent();
    updateNavigation();
    updateProgress();
    updateSidebar();
    
    // Scroll to top of content
    lessonContent.scrollTop = 0;
}

function updateLessonContent() {
    const lesson = currentCourse.lessons[currentLesson];
    lessonContent.innerHTML = lesson.content;
    lessonContent.classList.add('fade-in');
    
    // Remove animation class after animation completes
    setTimeout(() => {
        lessonContent.classList.remove('fade-in');
    }, 400);
}

function updateNavigation() {
    prevBtn.disabled = currentLesson === 0;
    nextBtn.disabled = currentLesson === currentCourse.lessons.length - 1;
    
    lessonCounter.textContent = `${currentLesson + 1} / ${currentCourse.lessons.length}`;
}

function updateProgress() {
    const progress = ((currentLesson + 1) / currentCourse.lessons.length) * 100;
    progressFill.style.width = progress + '%';
    progressText.textContent = Math.round(progress) + '% Complete';
}

function updateSidebar() {
    const lessonItems = document.querySelectorAll('.lesson-item');
    lessonItems.forEach((item, index) => {
        item.classList.remove('active', 'completed');
        
        if (index === currentLesson) {
            item.classList.add('active');
        }
        
        if (completedLessons.includes(index)) {
            item.classList.add('completed');
        }
    });
}

// Navigation button event listeners
prevBtn.addEventListener('click', () => {
    if (currentLesson > 0) {
        goToLesson(currentLesson - 1);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentLesson < currentCourse.lessons.length - 1) {
        // Mark current lesson as completed
        if (!completedLessons.includes(currentLesson)) {
            completedLessons.push(currentLesson);
        }
        goToLesson(currentLesson + 1);
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
        prevBtn.click();
    }
    if (e.key === 'ArrowRight' && !nextBtn.disabled) {
        nextBtn.click();
    }
});

// Auto-save progress to localStorage
function saveProgress() {
    const progress = {
        courseId: getCourseFromURL(),
        currentLesson,
        completedLessons,
        timestamp: Date.now()
    };
    localStorage.setItem('wastewise_course_progress', JSON.stringify(progress));
}

function loadProgress() {
    const saved = localStorage.getItem('wastewise_course_progress');
    if (saved) {
        const progress = JSON.parse(saved);
        const courseId = getCourseFromURL();
        
        // Only restore if it's the same course and saved within last 24 hours
        if (progress.courseId === courseId && (Date.now() - progress.timestamp) < 24 * 60 * 60 * 1000) {
            currentLesson = progress.currentLesson || 0;
            completedLessons = progress.completedLessons || [];
            updateLessonContent();
            updateNavigation();
            updateProgress();
            updateSidebar();
        }
    }
}

// Save progress whenever lesson changes
document.addEventListener('DOMContentLoaded', () => {
    // Load saved progress after course is loaded
    setTimeout(loadProgress, 100);
    
    // Save progress when navigating
    prevBtn.addEventListener('click', saveProgress);
    nextBtn.addEventListener('click', saveProgress);
});