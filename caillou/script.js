let gameState = {
    currentScene: 'start',
    hasPermission: false,
    action: null,
    soundEnabled: true,
    minigameActive: false
};

const GROUNDED_CHANCE = 0.6; // 60% chance to get grounded
const SPECIAL_ED_GROUNDED_CHANCE = 0.9; // 90% chance to get grounded for special ed scenario
const DORA_DATE_GROUNDED_CHANCE = 0.7; // 70% chance to get grounded for Dora date
const DORA_REJECT_CHANCE = 0.3; // 30% chance Dora rejects
const VENDING_MACHINE_GROUNDED_CHANCE = 0.75; // 75% chance to get grounded for vending machine
const PIN_GROUNDED_CHANCE = 0.9; // 90% chance to get grounded for pin prank
const RENAME_SCHOOL_GROUNDED_CHANCE = 0.7; // 80% chance to get grounded for renaming school
const MASCOTS_GROUNDED_CHANCE = 0.7; // 80% chance to get grounded when mascots arrive

const scenes = {
    start: {
        text: "Caillou is sitting in class, feeling very bored. Ms. Martin is teaching math, but Caillou doesn't want to learn. What should he do?",
        choices: [
            { id: 'choice1', text: '1. Pull the fire alarm', nextScene: 'askBathroom', action: 'fireAlarm' },
            { id: 'choice2', text: '2. Sneak to Chuck E. Cheese\'s', nextScene: 'askBathroom', action: 'chuckECheese' },
            { id: 'choice3', text: '3. Dance on your desk', nextScene: 'danceOnDesk' },
            { id: 'choice4', text: '4. Play Caillou theme song on school announcer', nextScene: 'askBathroom', action: 'themeSong' },
            { id: 'choice5', text: '5. Sneak into special ed classroom and dance on desks', nextScene: 'askBathroom', action: 'specialEd' },
            { id: 'choice6', text: '6. Wait till cafeteria', nextScene: 'waitForLunch', action: 'doraDate' },
            { id: 'choice7', text: '7. Put a pin on Ms. Martin\'s chair', nextScene: 'pinPrankChoice', action: 'pinPrank' },
            { id: 'choice8', text: '8. Change School name to Chuck E. Cheese\'s', nextScene: 'askBathroom', action: 'renameSchool' }
        ],
        background: 'classroom.png',
        character: 'caillou_bored.png'
    },

    teachersLoungeChoice: {
        text: "Caillou is in the hallway with the bathroom pass. Now's his chance to sneak into the teachers' lounge and change the school name!",
        choices: [
            { id: 'choice1', text: 'Sneak to the teachers\' lounge', nextScene: 'teachersLoungeMinigame' },
            { id: 'choice2', text: 'Actually go to the bathroom', nextScene: 'goodEnding' }
        ],
        background: 'hallway.png',
        character: 'caillou_sneaky.png'
    },
    teachersLoungeMinigame: {
        text: "Navigate to the teachers' lounge without getting caught! Use arrow keys or D-pad to move.",
        choices: [],
        background: 'hallway.png',
        character: 'caillou_sneaky.png',
        onLoad: function() {
            startMinigame('teachersLounge');
        }
    },
    renameSchoolTablet: {
        text: "Caillou sneaks into the teachers' lounge and finds the school tablet! It has the school management system open.",
        choices: [
            { id: 'choice1', text: 'Change school name to Chuck E. Cheese\'s', nextScene: 'renameResult' }
        ],
        background: 'hallway.png',
        character: 'caillou_sneaky.png'
    },
    renameResult: {
        text: "Caillou changes the school name to 'Chuck E. Cheese's' in the system and quickly runs back to class!",
        choices: [
            { id: 'choice1', text: 'Continue', nextScene: '' }
        ],
        background: 'classroom.png',
        character: 'caillou_innocent.png',
        onLoad: function() {
            if (Math.random() < RENAME_SCHOOL_GROUNDED_CHANCE) {
                document.getElementById('story-text').innerText = "As Caillou tries to leave the teachers' lounge, Principal Balding walks in! \"What are you doing in here?!\" He checks the tablet and sees the changes Caillou made!";
                
                // Add Principal Balding to the scene
                const principal = document.createElement('div');
                principal.id = 'principal';
                principal.style.position = 'absolute';
                principal.style.width = '180px';
                principal.style.height = '250px';
                principal.style.bottom = '20px';
                principal.style.right = '100px';
                principal.style.backgroundImage = "url('principal_balding.png')";
                principal.style.backgroundSize = 'contain';
                principal.style.backgroundPosition = 'bottom';
                principal.style.backgroundRepeat = 'no-repeat';
                document.getElementById('scene-container').appendChild(principal);
                
                document.getElementById('choice1').innerText = 'Continue';
                document.getElementById('choice1').onclick = function() {
                    // Remove principal when leaving the scene
                    const principal = document.getElementById('principal');
                    if (principal) principal.remove();
                    changeScene('badEnding');
                };
            } else {
                document.getElementById('story-text').innerText = "Caillou successfully changes the school name and sneaks back to class undetected. A few minutes later, there's a commotion outside...";
                document.getElementById('choice1').innerText = 'Continue';
                document.getElementById('choice1').onclick = function() {
                    changeScene('mascotsArrive');
                };
            }
        }
    },
    mascotsArrive: {
        text: "The classroom door bursts open and Chuck E. Cheese mascots walk in, looking very confused! \"Is this Chuck E. Cheese's?\" they ask. Everyone is shocked!",
        choices: [
            { id: 'choice1', text: 'Continue', nextScene: '' }
        ],
        background: 'classroom.png',
        character: 'caillou_innocent.png',
        onLoad: function() {
            // Add Chuck E. Cheese mascot to the scene
            const mascot = document.createElement('div');
            mascot.id = 'mascot';
            mascot.style.position = 'absolute';
            mascot.style.width = '200px';
            mascot.style.height = '300px';
            mascot.style.bottom = '20px';
            mascot.style.right = '100px';
            mascot.style.backgroundImage = "url('chuck_e_cheese_mascot.png')";
            mascot.style.backgroundSize = 'contain';
            mascot.style.backgroundPosition = 'bottom';
            mascot.style.backgroundRepeat = 'no-repeat';
            document.getElementById('scene-container').appendChild(mascot);
            
            if (Math.random() < MASCOTS_GROUNDED_CHANCE) {
                setTimeout(() => {
                    document.getElementById('story-text').innerText = "Principal Balding rushes in to see what's happening. He looks at the confused mascots, then at Caillou who can't stop giggling. \"CAILLOU! Did you change the school name in our system?!\"";
                    
                    // Add Principal Balding to the scene
                    const principal = document.createElement('div');
                    principal.id = 'principal';
                    principal.style.position = 'absolute';
                    principal.style.width = '180px';
                    principal.style.height = '250px';
                    principal.style.bottom = '20px';
                    principal.style.left = '100px';
                    principal.style.backgroundImage = "url('principal_balding.png')";
                    principal.style.backgroundSize = 'contain';
                    principal.style.backgroundPosition = 'bottom';
                    principal.style.backgroundRepeat = 'no-repeat';
                    document.getElementById('scene-container').appendChild(principal);
                    
                    document.getElementById('choice1').innerText = 'Continue';
                    document.getElementById('choice1').onclick = function() {
                        // Remove mascot and principal when leaving the scene
                        const mascot = document.getElementById('mascot');
                        if (mascot) mascot.remove();
                        const principal = document.getElementById('principal');
                        if (principal) principal.remove();
                        changeScene('badEnding');
                    };
                }, 2000);
            } else {
                setTimeout(() => {
                    document.getElementById('story-text').innerText = "The mascots are very confused but think it's some kind of special event. They hand out free Chuck E. Cheese's tokens to everyone before staff help them leave. No one ever figures out it was Caillou who changed the name!";
                    
                    document.getElementById('choice1').innerText = 'Continue';
                    document.getElementById('choice1').onclick = function() {
                        // Remove mascot when leaving the scene
                        const mascot = document.getElementById('mascot');
                        if (mascot) mascot.remove();
                        changeScene('goodEnding');
                    };
                }, 2000);
            }
        }
    },

    // New Dora date storyline
    waitForLunch: {
        text: "Caillou decides to wait until lunch time to find Dora. The clock ticks by slowly as Ms. Martin drones on about fractions...",
        choices: [
            { id: 'choice1', text: 'Continue', nextScene: 'lunchTime' }
        ],
        background: 'classroom.png',
        character: 'caillou_bored.png'
    },
    lunchTime: {
        text: "Finally, the lunch bell rings! Everyone rushes to the cafeteria. Caillou has several mischievous ideas for lunch time...",
        choices: [
            { id: 'choice1', text: 'Ask Dora out', nextScene: 'findDoraMinigame' },
            { id: 'choice2', text: 'Break the vending machine', nextScene: 'vendingMachineMinigame' },
            { id: 'choice3', text: 'Just eat lunch instead', nextScene: 'goodEnding' }
        ],
        background: 'cafeteria.png',
        character: 'caillou.png'
    },
    findDoraMinigame: {
        text: "Help Caillou find Dora in the crowded cafeteria! Use arrow keys to navigate through the lunch crowd.",
        choices: [],
        background: 'cafeteria.png',
        character: 'caillou_sneaky.png',
        onLoad: function() {
            startMinigame('findDora');
        }
    },
    askDoraOut: {
        text: "Caillou finds Dora sitting at a lunch table with her friends. He nervously approaches her.",
        choices: [
            { id: 'choice1', text: 'Ask Dora out on a date', nextScene: 'doraResponse' }
        ],
        background: 'cafeteria.png',
        character: 'caillou_romantic.png'
    },
    doraResponse: {
        text: "\"Hi Dora! Do you want to sneak out of school and go on a date with me?\" Caillou asks nervously.",
        choices: [],
        background: 'cafeteria.png',
        character: 'caillou_romantic.png',
        onLoad: function() {
            // 30% chance Dora says no
            if (Math.random() < DORA_REJECT_CHANCE) {
                setTimeout(() => {
                    document.getElementById('story-text').innerText = "Dora looks at Caillou like he's crazy. \"No way! We'll get in big trouble! And I like school!\" Caillou sadly returns to his lunch table.";
                    
                    // Add a continue button
                    const choicesContainer = document.getElementById('choices-container');
                    choicesContainer.innerHTML = '';
                    const button = document.createElement('button');
                    button.id = 'choice1';
                    button.className = 'choice-btn';
                    button.innerText = 'Continue';
                    button.addEventListener('click', () => {
                        changeScene('goodEnding');
                    });
                    choicesContainer.appendChild(button);
                }, 2000);
            } else {
                // 70% chance Dora says yes
                setTimeout(() => {
                    document.getElementById('story-text').innerText = "Dora's eyes light up with excitement! \"Yes! That sounds like an adventure! Let's go after lunch.\"";
                    
                    // Add a continue button
                    const choicesContainer = document.getElementById('choices-container');
                    choicesContainer.innerHTML = '';
                    const button = document.createElement('button');
                    button.id = 'choice1';
                    button.className = 'choice-btn';
                    button.innerText = 'Continue';
                    button.addEventListener('click', () => {
                        changeScene('planEscape');
                    });
                    choicesContainer.appendChild(button);
                }, 2000);
            }
        }
    },
    planEscape: {
        text: "Caillou and Dora whisper about their escape plan. \"We can sneak out through the vent in the janitor's closet,\" Caillou suggests.",
        choices: [
            { id: 'choice1', text: 'Try to escape through the vent', nextScene: 'doraVentMinigame' }
        ],
        background: 'cafeteria.png',
        character: 'caillou_sneaky.png'
    },
    doraVentMinigame: {
        text: "Help Caillou and Dora navigate through the vent system to escape school! Use arrow keys to move.",
        choices: [],
        background: 'vent.png',
        character: 'caillou_vent.png',
        onLoad: function() {
            startMinigame('doraVent');
        }
    },
    dateSuccess: {
        text: "Caillou and Dora successfully escape through the vents and make their way to a nearby kid-friendly restaurant!",
        choices: [
            { id: 'choice1', text: 'Enjoy your date', nextScene: 'dateRestaurant' }
        ],
        background: 'hallway.png',
        character: 'caillou_happy.png'
    },
    dateRestaurant: {
        text: "Caillou and Dora are having a wonderful time at the restaurant. They order juice boxes and chicken nuggets shaped like dinosaurs.",
        choices: [
            { id: 'choice1', text: 'Continue', nextScene: 'dateResult' }
        ],
        background: 'restaurant.png',
        character: 'caillou_romantic.png',
        onLoad: function() {
            // Add Dora to the scene
            const dora = document.createElement('div');
            dora.id = 'dora';
            dora.style.position = 'absolute';
            dora.style.width = '150px';
            dora.style.height = '200px';
            dora.style.bottom = '20px';
            dora.style.right = '200px';
            dora.style.backgroundImage = "url('dora_date.png')";
            dora.style.backgroundSize = 'contain';
            dora.style.backgroundPosition = 'bottom';
            dora.style.backgroundRepeat = 'no-repeat';
            document.getElementById('scene-container').appendChild(dora);
        },
        onExit: function() {
            // Remove Dora when leaving the scene
            const dora = document.getElementById('dora');
            if (dora) dora.remove();
        }
    },
    dateResult: {
        text: "Caillou and Dora are having the best date ever!",
        choices: [
            { id: 'choice1', text: 'Continue', nextScene: '' }
        ],
        background: 'restaurant.png',
        character: 'caillou_romantic.png',
        onLoad: function() {
            // Add Dora to the scene again
            const dora = document.createElement('div');
            dora.id = 'dora';
            dora.style.position = 'absolute';
            dora.style.width = '150px';
            dora.style.height = '200px';
            dora.style.bottom = '20px';
            dora.style.right = '200px';
            dora.style.backgroundImage = "url('dora_date.png')";
            dora.style.backgroundSize = 'contain';
            dora.style.backgroundPosition = 'bottom';
            dora.style.backgroundRepeat = 'no-repeat';
            document.getElementById('scene-container').appendChild(dora);
            
            if (Math.random() < DORA_DATE_GROUNDED_CHANCE) {
                document.getElementById('story-text').innerText = "Suddenly, school police officers burst into the restaurant! \"We've been looking for you two!\" They call both sets of parents immediately.";
                
                // Add school police officers to the scene
                const policeOfficers = document.createElement('div');
                policeOfficers.id = 'police-officers';
                policeOfficers.style.position = 'absolute';
                policeOfficers.style.width = '200px';
                policeOfficers.style.height = '150px';
                policeOfficers.style.bottom = '20px';
                policeOfficers.style.left = '80px';
                policeOfficers.style.backgroundImage = "url('police_officers.png')";
                policeOfficers.style.backgroundSize = 'contain';
                policeOfficers.style.backgroundPosition = 'bottom';
                policeOfficers.style.backgroundRepeat = 'no-repeat';
                document.getElementById('scene-container').appendChild(policeOfficers);
                
                document.getElementById('choice1').innerText = 'Continue';
                document.getElementById('choice1').onclick = function() {
                    // Remove police officers when leaving the scene
                    const officers = document.getElementById('police-officers');
                    if (officers) officers.remove();
                    const dora = document.getElementById('dora');
                    if (dora) dora.remove();
                    changeScene('doraDateBadEnding');
                };
            } else {
                document.getElementById('story-text').innerText = "Caillou and Dora have a wonderful date and make it back to school just in time for the last class. No one ever discovers they were gone!";
                document.getElementById('choice1').innerText = 'Continue';
                document.getElementById('choice1').onclick = function() {
                    const dora = document.getElementById('dora');
                    if (dora) dora.remove();
                    changeScene('goodEnding');
                };
            }
        }
    },
    doraDateBadEnding: {
        text: "Caillou gets sent home and his dad Boris is FURIOUS!",
        choices: [
            { id: 'choice1', text: 'Continue', nextScene: 'borisGone' }
        ],
        background: 'bedroom.png',
        character: 'caillou_crying.png',
        onLoad: function() {
            // Add Boris to the scene
            const character = document.getElementById('character');
            const boris = document.createElement('div');
            boris.id = 'boris';
            boris.style.position = 'absolute';
            boris.style.width = '180px';
            boris.style.height = '250px';
            boris.style.bottom = '20px';
            boris.style.right = '100px';
            boris.style.backgroundImage = "url('boris_angry.png')";
            boris.style.backgroundSize = 'contain';
            boris.style.backgroundPosition = 'bottom';
            boris.style.backgroundRepeat = 'no-repeat';
            document.getElementById('scene-container').appendChild(boris);
            
            // Play the grounding audio
            if (gameState.soundEnabled) {
                const groundingSound = new Audio('badEnding.mp3');
                groundingSound.volume = 0.8;
                groundingSound.play();
            }
            
            // Update the text after a short delay to match the audio
            setTimeout(() => {
                document.getElementById('story-text').innerHTML = 
                    "<strong>BORIS:</strong> OH OH OH OH OH OH! CAILLOU HOW DARE YOU SNEAK OUT OF SCHOOL TO GO ON A DATE WITH DORA! THAT'S IT! YOU ARE GROUNDED GROUNDED GROUNDED GROUNDED FOR 294,092,409 YEARS! NO TV, NO COMPUTER, NO CHUCK E. CHEESE'S, NO DESSERTS, NO TOYS, NO GOING OUTSIDE, NO NOTHING! GO TO YOUR ROOM RIGHT NOW!";
            }, 500);
        },
        onExit: function() {
            // Remove Boris when leaving the scene
            const boris = document.getElementById('boris');
            if (boris) boris.remove();
        }
    },
    askBathroom: {
        text: "Caillou raises his hand. \"Ms. Martin, can I please go to the bathroom? It's an emergency!\" Ms. Martin looks suspicious.",
        choices: [
            { id: 'choice1', text: 'Make her believe you really need to go', nextScene: 'convinceTeacher' },
            { id: 'choice2', text: 'Give up and stay in class', nextScene: 'start' }
        ],
        background: 'classroom.png',
        character: 'caillou_raise_hand.png'
    },
    convinceTeacher: {
        text: "Caillou does a little potty dance. \"Please Ms. Martin, I really can't hold it!\" Ms. Martin sighs.",
        choices: [
            { id: 'choice1', text: 'Continue', nextScene: 'bathroomPermission' }
        ],
        background: 'classroom.png',
        character: 'caillou_dancing.png'
    },
    bathroomPermission: {
        text: "\"Fine, Caillou. You have 5 minutes. Don't make me come looking for you.\" Ms. Martin hands you the hall pass.",
        choices: [],
        background: 'classroom.png',
        character: 'caillou_happy.png',
        onLoad: function() {
            gameState.hasPermission = true;
            setTimeout(() => {
                if (gameState.action === 'fireAlarm') {
                    changeScene('fireAlarmChoice');
                } else if (gameState.action === 'chuckECheese') {
                    changeScene('chuckECheeseChoice');
                } else if (gameState.action === 'themeSong') {
                    changeScene('themeSongChoice');
                } else if (gameState.action === 'specialEd') {
                    changeScene('specialEdChoice');
                } else if (gameState.action === 'renameSchool') {
                    changeScene('teachersLoungeChoice');
                }
            }, 2000);
        }
    },
    specialEdChoice: {
        text: "Caillou is in the hallway with the bathroom pass. Now's his chance to sneak into the special education classroom!",
        choices: [
            { id: 'choice1', text: 'Sneak to the special ed classroom', nextScene: 'specialEdMinigame' },
            { id: 'choice2', text: 'Actually go to the bathroom', nextScene: 'goodEnding' }
        ],
        background: 'hallway.png',
        character: 'caillou_sneaky.png'
    },
    specialEdMinigame: {
        text: "You need to sneak to the special education classroom without getting caught! Use arrow keys to move.",
        choices: [],
        background: 'hallway.png',
        character: 'caillou_sneaky.png',
        onLoad: function() {
            startMinigame('specialEd');
        }
    },
    specialEdClassroom: {
        text: "Caillou sneaks into the special education classroom where Mrs. Catherine is teaching. The students look surprised to see him.",
        choices: [
            { id: 'choice1', text: 'Dance on a student\'s desk!', nextScene: 'specialEdDance' }
        ],
        background: 'special_ed_classroom.png',
        character: 'caillou_sneaky.png'
    },
    specialEdDance: {
        text: "Caillou jumps onto a student's desk and starts dancing wildly! Some students clap while others look confused. Mrs. Catherine is shocked!",
        choices: [
            { id: 'choice1', text: 'Continue', nextScene: 'specialEdResult' }
        ],
        background: 'special_ed_classroom.png',
        character: 'caillou_desk_dance_special.png'
    },
    specialEdResult: {
        text: "Mrs. Catherine calls the principal immediately! Caillou is in big trouble!",
        choices: [
            { id: 'choice1', text: 'Continue', nextScene: '' }
        ],
        background: 'special_ed_classroom.png',
        character: 'caillou_innocent.png',
        onLoad: function() {
            if (Math.random() < SPECIAL_ED_GROUNDED_CHANCE) {
                document.getElementById('story-text').innerText = "Principal Balding rushes in and grabs Caillou. \"HOW DARE YOU DISRUPT THE SPECIAL EDUCATION CLASS!\" He calls Caillou's parents immediately. School police officers arrive to escort Caillou to the principal's office.";
                document.getElementById('choice1').innerText = 'Continue';
                document.getElementById('choice1').onclick = function() {
                    changeScene('badEnding');
                };
            } else {
                document.getElementById('story-text').innerText = "Mrs. Catherine is so surprised that she doesn't know how to react! In the confusion, Caillou manages to slip out of the classroom and return to his own class before anyone can report him!";
                document.getElementById('choice1').innerText = 'Continue';
                document.getElementById('choice1').onclick = function() {
                    changeScene('goodEnding');
                };
            }
        }
    },
    fireAlarmChoice: {
        text: "Caillou is in the hallway with the bathroom pass. What should he do now?",
        choices: [
            { id: 'choice1', text: 'Pull the fire alarm', nextScene: 'fireAlarmMinigame' },
            { id: 'choice2', text: 'Actually go to the bathroom', nextScene: 'goodEnding' }
        ],
        background: 'hallway.png',
        character: 'caillou_sneaky.png'
    },
    fireAlarmMinigame: {
        text: "You need to sneak to the fire alarm without getting caught by teachers! Use arrow keys to move.",
        choices: [],
        background: 'hallway.png',
        character: 'caillou_sneaky.png',
        onLoad: function() {
            startMinigame('fireAlarm');
        }
    },
    pullFireAlarm: {
        text: "Caillou sneaks to the fire alarm. He looks around to make sure no one is watching, then pulls it with his shirt covering his hand. RIIIING! The alarm blares!",
        choices: [
            { id: 'choice1', text: 'Run back to class quickly', nextScene: 'fireAlarmResult' }
        ],
        background: 'fire_alarm.png',
        character: 'caillou_pull_alarm.png'
    },
    fireAlarmResult: {
        text: "Caillou rushes back to class amid the chaos. Ms. Martin is gathering students to evacuate.",
        choices: [
            { id: 'choice1', text: 'Continue', nextScene: '' }
        ],
        background: 'classroom_chaos.png',
        character: 'caillou_innocent.png',
        onLoad: function() {
            if (Math.random() < GROUNDED_CHANCE) {
                document.getElementById('story-text').innerText = "Ms. Martin looks at Caillou suspiciously. \"Caillou, you were just gone when the alarm went off. Did you pull it?\" She doesn't wait for an answer and sends Caillou to the principal's office.";
                document.getElementById('choice1').innerText = 'Continue';
                document.getElementById('choice1').onclick = function() {
                    changeScene('badEnding');
                };
            } else {
                document.getElementById('story-text').innerText = "Everyone evacuates the building. In the confusion, no one notices that Caillou was just gone. The fire department comes, and school is dismissed early. Caillou got away with it!";
                document.getElementById('choice1').innerText = 'Continue';
                document.getElementById('choice1').onclick = function() {
                    changeScene('goodEnding');
                };
            }
        }
    },
    chuckECheeseChoice: {
        text: "Caillou is in the hallway with the bathroom pass. Now's his chance to escape to Chuck E. Cheese's!",
        choices: [
            { id: 'choice1', text: 'Try to escape through the vent', nextScene: 'ventMazeMinigame' },
            { id: 'choice2', text: 'Actually go to the bathroom', nextScene: 'goodEnding' }
        ],
        background: 'hallway.png',
        character: 'caillou_sneaky.png'
    },
    ventMazeMinigame: {
        text: "Navigate through the dusty vent maze to find the exit! Use arrow keys to move.",
        choices: [],
        background: 'vent.png',
        character: 'caillou_vent.png',
        onLoad: function() {
            startMinigame('ventMaze');
        }
    },
    ventEscape: {
        text: "Caillou finds a vent near the floor. He unscrews it with a coin and crawls inside. After navigating the dusty vents, he finds an exit that leads outside the school!",
        choices: [
            { id: 'choice1', text: 'Run to Chuck E. Cheese\'s', nextScene: 'chuckECheeseResult' }
        ],
        background: 'vent.png',
        character: 'caillou_vent.png'
    },
    chuckECheeseResult: {
        text: "Caillou makes it to Chuck E. Cheese's and has a blast playing games and eating pizza!",
        choices: [
            { id: 'choice1', text: 'Continue', nextScene: '' }
        ],
        background: 'chuck_e_cheese.png',
        character: 'caillou_happy.png',
        onLoad: function() {
            if (Math.random() < GROUNDED_CHANCE) {
                document.getElementById('story-text').innerText = "While Caillou is playing games, Principal Balding walks in with security footage showing Caillou escaping! School police officers take Caillou home, where he gets grounded for 92,402,409 years!";
                
                // Add school police officers to the scene
                const policeOfficers = document.createElement('div');
                policeOfficers.id = 'police-officers';
                policeOfficers.style.position = 'absolute';
                policeOfficers.style.width = '200px';
                policeOfficers.style.height = '150px';
                policeOfficers.style.bottom = '20px';
                policeOfficers.style.left = '80px';
                policeOfficers.style.backgroundImage = "url('police_officers.png')";
                policeOfficers.style.backgroundSize = 'contain';
                policeOfficers.style.backgroundPosition = 'bottom';
                policeOfficers.style.backgroundRepeat = 'no-repeat';
                document.getElementById('scene-container').appendChild(policeOfficers);
                
                document.getElementById('choice1').innerText = 'Continue';
                document.getElementById('choice1').onclick = function() {
                    // Remove police officers when leaving the scene
                    const officers = document.getElementById('police-officers');
                    if (officers) officers.remove();
                    changeScene('badEnding');
                };
            } else {
                document.getElementById('story-text').innerText = "Caillou has the best day ever at Chuck E. Cheese's! He makes it home before his parents and pretends he was at school all day. No one ever finds out about his adventure!";
                document.getElementById('choice1').innerText = 'Continue';
                document.getElementById('choice1').onclick = function() {
                    changeScene('goodEnding');
                };
            }
        }
    },
    themeSongChoice: {
        text: "Caillou is in the hallway with the bathroom pass. Now's his chance to play the Caillou theme song on the school announcer!",
        choices: [
            { id: 'choice1', text: 'Sneak to the principal\'s office', nextScene: 'principalOfficeMinigame' },
            { id: 'choice2', text: 'Actually go to the bathroom', nextScene: 'goodEnding' }
        ],
        background: 'hallway.png',
        character: 'caillou_sneaky.png'
    },
    principalOfficeMinigame: {
        text: "You need to sneak to the principal's office without getting caught! Use arrow keys to move.",
        choices: [],
        background: 'hallway.png',
        character: 'caillou_sneaky.png',
        onLoad: function() {
            startMinigame('principalOffice');
        }
    },
    punchPrincipal: {
        text: "Caillou sneaks into the principal's office. Principal Balding is sitting at his desk with his back turned. Caillou needs to reach the announcer system!",
        choices: [
            { id: 'choice1', text: 'Punch the principal!', nextScene: 'punchResult' },
            { id: 'choice2', text: 'Sneak around him to the announcer', nextScene: 'announcerReached' }
        ],
        background: 'hallway.png',
        character: 'caillou_sneaky.png'
    },
    punchResult: {
        text: "Caillou runs up and punches Principal Balding! He falls out of his chair in shock!",
        choices: [
            { id: 'choice1', text: 'Quickly use the announcer', nextScene: '' }
        ],
        background: 'hallway.png',
        character: 'caillou_happy.png',
        onLoad: function() {
            if (Math.random() < GROUNDED_CHANCE) {
                document.getElementById('story-text').innerText = "Principal Balding quickly recovers and grabs Caillou's arm! \"WHAT DO YOU THINK YOU'RE DOING?!\" School police officers rush in and take Caillou to the detention room before calling his parents!";
                
                // Add school police officers to the scene
                const policeOfficers = document.createElement('div');
                policeOfficers.id = 'police-officers';
                policeOfficers.style.position = 'absolute';
                policeOfficers.style.width = '200px';
                policeOfficers.style.height = '150px';
                policeOfficers.style.bottom = '20px';
                policeOfficers.style.left = '80px';
                policeOfficers.style.backgroundImage = "url('police_officers.png')";
                policeOfficers.style.backgroundSize = 'contain';
                policeOfficers.style.backgroundPosition = 'bottom';
                policeOfficers.style.backgroundRepeat = 'no-repeat';
                document.getElementById('scene-container').appendChild(policeOfficers);
                
                document.getElementById('choice1').innerText = 'Continue';
                document.getElementById('choice1').onclick = function() {
                    // Remove police officers when leaving the scene
                    const officers = document.getElementById('police-officers');
                    if (officers) officers.remove();
                    changeScene('badEnding');
                };
            } else {
                document.getElementById('story-text').innerText = "Principal Balding is so shocked that he falls unconscious! Caillou quickly runs to the announcer system.";
                document.getElementById('choice1').innerText = 'Continue';
                document.getElementById('choice1').onclick = function() {
                    changeScene('playThemeSong');
                };
            }
        }
    },
    announcerReached: {
        text: "Caillou successfully sneaks around the principal and reaches the announcer system!",
        choices: [
            { id: 'choice1', text: 'Play the Caillou theme song at 999% volume', nextScene: 'playThemeSong' }
        ],
        background: 'hallway.png',
        character: 'caillou_sneaky.png'
    },
    playThemeSong: {
        text: "Caillou turns the volume all the way up and plays the Caillou theme song on the school announcer system at 999% volume! The whole school can hear it!",
        choices: [
            { id: 'choice1', text: 'Run back to class', nextScene: 'themeSongResult' }
        ],
        background: 'hallway.png',
        character: 'caillou_happy.png',
        onLoad: function() {
            if (gameState.soundEnabled) {
                const themeSong = document.getElementById('theme-song');
                themeSong.volume = 1.0;
                themeSong.play();
            }
        }
    },
    themeSongResult: {
        text: "The Caillou theme song blasts through the entire school! Everyone is covering their ears!",
        choices: [
            { id: 'choice1', text: 'Continue', nextScene: '' }
        ],
        background: 'classroom_chaos.png',
        character: 'caillou_innocent.png',
        onLoad: function() {
            if (Math.random() < GROUNDED_CHANCE) {
                document.getElementById('story-text').innerHTML = 
                    "<strong>BORIS:</strong> OH OH OH OH OH OH! CAILLOU HOW DARE YOU! THAT'S IT! YOU ARE GROUNDED GROUNDED GROUNDED GROUNDED FOR 294,092,409 YEARS! NO TV, NO COMPUTER, NO CHUCK E. CHEESE'S, NO DESSERTS, NO TOYS, NO GOING OUTSIDE, NO NOTHING! GO TO YOUR ROOM RIGHT NOW!";
                document.getElementById('choice1').innerText = 'Continue';
                document.getElementById('choice1').onclick = function() {
                    changeScene('badEnding');
                };
            } else {
                document.getElementById('story-text').innerText = "Everyone is so annoyed by the song that no one notices Caillou sneaking back to his seat. Principal Balding frantically tries to turn it off, but can't figure out how! School is dismissed early due to the 'audio emergency'!";
                document.getElementById('choice1').innerText = 'Continue';
                document.getElementById('choice1').onclick = function() {
                    changeScene('goodEnding');
                };
            }
            
            // Stop the song
            const themeSong = document.getElementById('theme-song');
            themeSong.pause();
            themeSong.currentTime = 0;
        }
    },
    danceOnDesk: {
        text: "Caillou suddenly stands up on his desk and starts dancing wildly! The other kids cheer him on!",
        choices: [
            { id: 'choice1', text: 'Continue dancing', nextScene: 'deskBreaks' }
        ],
        background: 'classroom.png',
        character: 'caillou_desk_dance.png'
    },
    deskBreaks: {
        text: "CRASH! The desk collapses under Caillou's dancing feet! Ms. Martin is furious and calls Caillou's parents immediately.",
        choices: [
            { id: 'choice1', text: 'Continue', nextScene: 'badEnding' }
        ],
        background: 'classroom.png',
        character: 'caillou_fallen.png'
    },
    goodEnding: {
        text: "Caillou had a successful adventure and didn't get caught! He goes home happy and no one ever knows what happened.",
        choices: [
            { id: 'choice1', text: 'Play Again', nextScene: 'start' }
        ],
        background: 'home.png',
        character: 'caillou_happy.png'
    },
    badEnding: {
        text: "Caillou gets sent home and his dad Boris is FURIOUS!",
        choices: [
            { id: 'choice1', text: 'Continue', nextScene: 'borisGone' }
        ],
        background: 'bedroom.png',
        character: 'caillou_crying.png',
        onLoad: function() {
            // Add Boris to the scene
            const character = document.getElementById('character');
            const boris = document.createElement('div');
            boris.id = 'boris';
            boris.style.position = 'absolute';
            boris.style.width = '180px';
            boris.style.height = '250px';
            boris.style.bottom = '20px';
            boris.style.right = '100px';
            boris.style.backgroundImage = "url('boris_angry.png')";
            boris.style.backgroundSize = 'contain';
            boris.style.backgroundPosition = 'bottom';
            boris.style.backgroundRepeat = 'no-repeat';
            document.getElementById('scene-container').appendChild(boris);
            
            // Play the grounding audio
            if (gameState.soundEnabled) {
                const groundingSound = new Audio('badEnding.mp3');
                groundingSound.volume = 0.8;
                groundingSound.play();
            }
            
            // Update the text after a short delay to match the audio
            setTimeout(() => {
                // Get the action that led to grounding
                let action = "MISBEHAVING AT SCHOOL";
                if (gameState.action === 'fireAlarm') {
                    action = "PULL THE FIRE ALARM";
                } else if (gameState.action === 'chuckECheese') {
                    action = "SNEAK TO CHUCK E. CHEESE'S";
                } else if (gameState.action === 'themeSong') {
                    action = "PLAY THE CAILLOU THEME SONG ON THE SCHOOL ANNOUNCER";
                } else if (gameState.action === 'specialEd') {
                    action = "SNEAK INTO THE SPECIAL ED CLASSROOM AND DANCE ON DESKS";
                } else if (gameState.action === 'doraDate') {
                    action = "SNEAK OUT OF SCHOOL TO GO ON A DATE WITH DORA";
                } else if (gameState.action === 'pinPrank') {
                    action = "PUT A PIN ON YOUR TEACHER'S CHAIR";
                } else if (gameState.action === 'renameSchool') {
                    action = "CHANGE THE SCHOOL NAME TO CHUCK E. CHEESE'S";
                }
                
                document.getElementById('story-text').innerHTML = 
                    "<strong>BORIS:</strong> OH OH OH OH OH OH! CAILLOU HOW DARE YOU " + action + "! THAT'S IT! YOU ARE GROUNDED GROUNDED GROUNDED GROUNDED FOR 294,092,409 YEARS! NO TV, NO COMPUTER, NO CHUCK E. CHEESE'S, NO DESSERTS, NO TOYS, NO GOING OUTSIDE, NO NOTHING! GO TO YOUR ROOM RIGHT NOW!";
            }, 500);
        },
        onExit: function() {
            // Remove Boris when leaving the scene
            const boris = document.getElementById('boris');
            if (boris) boris.remove();
        }
    },
    borisGone: {
        text: "Caillou gets sent home and is GROUNDED for 294,092,409 years! His parents take away all his toys and he has to go to bed without dinner.",
        choices: [
            { id: 'choice1', text: 'Play Again', nextScene: 'start' }
        ],
        background: 'bedroom.png',
        character: 'caillou_crying.png'
    },
    // Vending machine storyline
    vendingMachineMinigame: {
        text: "Help Caillou sneak to the vending machine without getting caught by the lunch monitor! Use arrow keys or the D-pad to move.",
        choices: [],
        background: 'cafeteria.png',
        character: 'caillou_sneaky.png',
        onLoad: function() {
            startMinigame('vendingMachine');
        }
    },
    breakVendingMachine: {
        text: "Caillou reaches the vending machine! He looks around to make sure no one is watching...",
        choices: [
            { id: 'choice1', text: 'Break the vending machine!', nextScene: 'vendingMachineResult' }
        ],
        background: 'cafeteria.png',
        character: 'caillou_sneaky.png'
    },
    vendingMachineResult: {
        text: "Caillou kicks the vending machine hard and shakes it violently! The machine makes weird noises and starts dispensing snacks everywhere!",
        choices: [
            { id: 'choice1', text: 'Continue', nextScene: '' }
        ],
        background: 'cafeteria.png',
        character: 'caillou_happy.png',
        onLoad: function() {
            if (Math.random() < VENDING_MACHINE_GROUNDED_CHANCE) {
                document.getElementById('story-text').innerText = "Ms. Oldwitch, the lunch monitor, spots Caillou immediately! \"WHAT DO YOU THINK YOU'RE DOING?!\" She grabs Caillou by the ear and drags him to the principal's office.";
                
                // Add lunch monitor to the scene
                const lunchMonitor = document.createElement('div');
                lunchMonitor.id = 'lunch-monitor';
                lunchMonitor.style.position = 'absolute';
                lunchMonitor.style.width = '180px';
                lunchMonitor.style.height = '250px';
                lunchMonitor.style.bottom = '20px';
                lunchMonitor.style.right = '100px';
                lunchMonitor.style.backgroundImage = "url('lunch_monitor.png')";
                lunchMonitor.style.backgroundSize = 'contain';
                lunchMonitor.style.backgroundPosition = 'bottom';
                lunchMonitor.style.backgroundRepeat = 'no-repeat';
                document.getElementById('scene-container').appendChild(lunchMonitor);
                
                document.getElementById('choice1').innerText = 'Continue';
                document.getElementById('choice1').onclick = function() {
                    // Remove lunch monitor when leaving the scene
                    const monitor = document.getElementById('lunch-monitor');
                    if (monitor) monitor.remove();
                    changeScene('badEnding');
                };
            } else {
                document.getElementById('story-text').innerText = "Everyone rushes to grab the free snacks, creating chaos in the cafeteria! In the confusion, no one notices that Caillou was the one who broke the machine. He sneaks away with a handful of candy bars!";
                document.getElementById('choice1').innerText = 'Continue';
                document.getElementById('choice1').onclick = function() {
                    changeScene('goodEnding');
                };
            }
        }
    },
    // Pin prank storyline
    pinPrankChoice: {
        text: "Caillou gets a mischievous idea to put a pin on Ms. Martin's chair. He waits for her to leave the classroom...",
        choices: [
            { id: 'choice1', text: 'Wait for Ms. Martin to leave', nextScene: 'teacherLeaves' }
        ],
        background: 'classroom.png',
        character: 'caillou_bored.png'
    },
    teacherLeaves: {
        text: "Ms. Martin announces, \"I need to step out for a moment. Everyone continue working on your math problems. I'll be right back.\" She leaves the classroom.",
        choices: [
            { id: 'choice1', text: 'Get up and find a pin', nextScene: 'pinPrankMinigame' },
            { id: 'choice2', text: 'Just keep working on math', nextScene: 'goodEnding' }
        ],
        background: 'classroom.png',
        character: 'caillou_sneaky.png'
    },
    pinPrankMinigame: {
        text: "Quick! Find a pin and place it on Ms. Martin's chair before she returns! Use arrow keys or D-pad to move.",
        choices: [],
        background: 'classroom.png',
        character: 'caillou_sneaky.png',
        onLoad: function() {
            startMinigame('pinPrank');
        }
    },
    placePin: {
        text: "Caillou finds a pin in the craft area and rushes to Ms. Martin's chair...",
        choices: [
            { id: 'choice1', text: 'Place the pin and return to your seat', nextScene: 'teacherReturns' }
        ],
        background: 'classroom.png',
        character: 'caillou_sneaky.png'
    },
    teacherReturns: {
        text: "Caillou quickly returns to his seat just as Ms. Martin comes back into the classroom. \"Thank you for being so well-behaved while I was gone,\" she says.",
        choices: [
            { id: 'choice1', text: 'Continue', nextScene: 'teacherSitsOnPin' }
        ],
        background: 'classroom.png',
        character: 'caillou_innocent.png'
    },
    teacherSitsOnPin: {
        text: "Ms. Martin walks to her desk and sits down on her chair...",
        choices: [
            { id: 'choice1', text: 'Continue', nextScene: 'pinPrankResult' }
        ],
        background: 'classroom.png',
        character: 'caillou_innocent.png'
    },
    pinPrankResult: {
        text: "OWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW! Ms. Martin jumps up from her chair in pain!",
        choices: [
            { id: 'choice1', text: 'Continue', nextScene: '' }
        ],
        background: 'classroom.png',
        character: 'caillou_innocent.png',
        onLoad: function() {
            if (Math.random() < PIN_GROUNDED_CHANCE) {
                document.getElementById('story-text').innerText = "OWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW! Ms. Martin jumps up from her chair in pain! She looks furiously around the classroom. \"Who did this?\" All the other students immediately point at Caillou!";
                document.getElementById('choice1').innerText = 'Continue';
                document.getElementById('choice1').onclick = function() {
                    changeScene('badEnding');
                };
            } else {
                document.getElementById('story-text').innerText = "OWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW! Ms. Martin jumps up from her chair in pain! She looks furiously around the classroom. \"Who did this?\" No one says anything, and Caillou manages to look completely innocent!";
                document.getElementById('choice1').innerText = 'Continue';
                document.getElementById('choice1').onclick = function() {
                    changeScene('goodEnding');
                };
            }
        }
    },
};

function startMinigame(type) {
    gameState.minigameActive = true;
    
    const minigameContainer = document.getElementById('minigame-container');
    const player = document.getElementById('player');
    const obstaclesContainer = document.getElementById('obstacles-container');
    const goal = document.getElementById('goal');
    const minigameText = document.getElementById('minigame-text');
    
    minigameContainer.classList.remove('hidden');
    obstaclesContainer.innerHTML = '';
    
    let playerX = 50;
    let playerY = 280;
    let goalX, goalY;
    let obstacles = [];
    
    // Add virtual D-pad for mobile controls
    const dpad = document.createElement('div');
    dpad.id = 'virtual-dpad';
    dpad.innerHTML = `
        <div class="dpad-up">▲</div>
        <div class="dpad-row">
            <div class="dpad-left">◀</div>
            <div class="dpad-center"></div>
            <div class="dpad-right">▶</div>
        </div>
        <div class="dpad-down">▼</div>
    `;
    minigameContainer.appendChild(dpad);
    
    // Set up the specific minigame
    switch(type) {
        case 'teachersLounge':
            minigameText.innerText = "Sneak to the teachers' lounge to access the school tablet! Use arrow keys or D-pad to move.";
            goalX = 700;
            goalY = 150;
            
            // Make the goal look like a tablet
            goal.style.backgroundImage = "none";
            goal.style.backgroundColor = "#333";
            goal.style.borderRadius = "5px";
            goal.style.width = "40px";
            goal.style.height = "60px";
            
            // Create obstacles (teachers and staff)
            for (let i = 0; i < 5; i++) {
                const obstacle = document.createElement('div');
                obstacle.className = 'obstacle';
                obstaclesContainer.appendChild(obstacle);
                
                const obsX = 150 + Math.random() * 500;
                const obsY = 50 + Math.random() * 250;
                const speedX = Math.random() * 3 - 1.5;
                const speedY = Math.random() * 3 - 1.5;
                
                obstacles.push({
                    element: obstacle,
                    x: obsX,
                    y: obsY,
                    speedX: speedX,
                    speedY: speedY,
                    width: 60,
                    height: 80
                });
            }
            break;
        case 'findDora':
            minigameText.innerText = "Find Dora in the crowded cafeteria! Use arrow keys or D-pad to move.";
            goalX = 700;
            goalY = 150;
            
            // Create obstacles (other students)
            for (let i = 0; i < 10; i++) {
                const obstacle = document.createElement('div');
                obstacle.className = 'obstacle';
                obstacle.style.backgroundImage = 'none';
                obstacle.style.backgroundColor = '#ff9999';
                obstacle.style.width = '40px';
                obstacle.style.height = '40px';
                obstacle.style.borderRadius = '50%';
                obstaclesContainer.appendChild(obstacle);
                
                const obsX = 100 + Math.random() * 600;
                const obsY = 50 + Math.random() * 250;
                const speedX = Math.random() * 2 - 1;
                const speedY = Math.random() * 2 - 1;
                
                obstacles.push({
                    element: obstacle,
                    x: obsX,
                    y: obsY,
                    speedX: speedX,
                    speedY: speedY,
                    width: 40,
                    height: 40
                });
            }
            break;
        case 'doraVent':
            minigameText.innerText = "Escape through the vent system with Dora! Use arrow keys or D-pad to move.";
            goalX = 700;
            goalY = 280;
            
            // Create maze walls
            for (let i = 0; i < 12; i++) {
                const obstacle = document.createElement('div');
                obstacle.className = 'obstacle';
                obstacle.style.backgroundImage = 'none';
                obstacle.style.backgroundColor = '#888';
                obstacle.style.width = i % 2 === 0 ? '150px' : '20px';
                obstacle.style.height = i % 2 === 0 ? '20px' : '150px';
                obstaclesContainer.appendChild(obstacle);
                
                const obsX = 100 + Math.floor(i/3) * 150;
                const obsY = 50 + (i % 3) * 100;
                
                obstacles.push({
                    element: obstacle,
                    x: obsX,
                    y: obsY,
                    speedX: 0,
                    speedY: 0,
                    width: i % 2 === 0 ? 150 : 20,
                    height: i % 2 === 0 ? 20 : 150,
                    isVentWall: true  // Flag to identify vent walls
                });
            }
            break;
        case 'fireAlarm':
            minigameText.innerText = "Navigate to the fire alarm without getting caught! Use arrow keys or D-pad to move.";
            goalX = 700;
            goalY = 50;
            
            // Create obstacles (teachers)
            for (let i = 0; i < 3; i++) {
                const obstacle = document.createElement('div');
                obstacle.className = 'obstacle';
                obstaclesContainer.appendChild(obstacle);
                
                const obsX = 200 + Math.random() * 400;
                const obsY = 50 + Math.random() * 200;
                const speedX = Math.random() * 2 - 1;
                const speedY = Math.random() * 2 - 1;
                
                obstacles.push({
                    element: obstacle,
                    x: obsX,
                    y: obsY,
                    speedX: speedX,
                    speedY: speedY
                });
            }
            break;
        case 'ventMaze':
            minigameText.innerText = "Navigate through the dusty vent maze to find the exit! Use arrow keys or D-pad to move.";
            goalX = 700;
            goalY = 280;
            
            // Create maze walls
            for (let i = 0; i < 10; i++) {
                const obstacle = document.createElement('div');
                obstacle.className = 'obstacle';
                obstacle.style.backgroundImage = 'none';
                obstacle.style.backgroundColor = '#888';
                obstacle.style.width = '150px';
                obstacle.style.height = '20px';
                obstaclesContainer.appendChild(obstacle);
                
                const obsX = 100 + Math.floor(i/2) * 150;
                const obsY = 50 + (i % 2) * 150;
                
                obstacles.push({
                    element: obstacle,
                    x: obsX,
                    y: obsY,
                    speedX: 0,
                    speedY: 0,
                    width: 150,
                    height: 20,
                    isVentWall: true  // Flag to identify vent walls
                });
            }
            break;
        case 'principalOffice':
            minigameText.innerText = "Sneak to the principal's office without getting caught! Use arrow keys or D-pad to move.";
            goalX = 700;
            goalY = 150;
            
            // Create obstacles (teachers and hall monitors)
            for (let i = 0; i < 4; i++) {
                const obstacle = document.createElement('div');
                obstacle.className = 'obstacle';
                obstaclesContainer.appendChild(obstacle);
                
                const obsX = 150 + Math.random() * 500;
                const obsY = 50 + Math.random() * 250;
                const speedX = Math.random() * 3 - 1.5;
                const speedY = Math.random() * 3 - 1.5;
                
                obstacles.push({
                    element: obstacle,
                    x: obsX,
                    y: obsY,
                    speedX: speedX,
                    speedY: speedY
                });
            }
            break;
        case 'specialEd':
            minigameText.innerText = "Sneak to the special education classroom without getting caught! Use arrow keys or D-pad to move.";
            goalX = 700;
            goalY = 200;
            
            // Create obstacles (teachers and staff)
            for (let i = 0; i < 5; i++) {
                const obstacle = document.createElement('div');
                obstacle.className = 'obstacle';
                obstaclesContainer.appendChild(obstacle);
                
                const obsX = 150 + Math.random() * 500;
                const obsY = 50 + Math.random() * 250;
                const speedX = Math.random() * 2.5 - 1.25;
                const speedY = Math.random() * 2.5 - 1.25;
                
                obstacles.push({
                    element: obstacle,
                    x: obsX,
                    y: obsY,
                    speedX: speedX,
                    speedY: speedY
                });
            }
            break;
        case 'vendingMachine':
            minigameText.innerText = "Sneak to the vending machine without getting caught by the lunch monitor! Use arrow keys or D-pad to move.";
            goalX = 700;
            goalY = 150;
            
            // Create obstacles (lunch monitor and other students)
            for (let i = 0; i < 4; i++) {
                const obstacle = document.createElement('div');
                obstacle.className = 'obstacle';
                
                // Make the first obstacle the lunch monitor
                if (i === 0) {
                    obstacle.style.backgroundImage = "url('lunch_monitor.png')";
                    obstacle.style.width = '70px';
                    obstacle.style.height = '90px';
                } else {
                    obstacle.style.backgroundImage = 'none';
                    obstacle.style.backgroundColor = '#ff9999';
                    obstacle.style.width = '40px';
                    obstacle.style.height = '40px';
                    obstacle.style.borderRadius = '50%';
                }
                
                obstaclesContainer.appendChild(obstacle);
                
                const obsX = 150 + Math.random() * 500;
                const obsY = 50 + Math.random() * 200;
                const speedX = Math.random() * 3 - 1.5;
                const speedY = Math.random() * 3 - 1.5;
                
                obstacles.push({
                    element: obstacle,
                    x: obsX,
                    y: obsY,
                    speedX: i === 0 ? speedX * 1.5 : speedX, // Lunch monitor moves faster
                    speedY: i === 0 ? speedY * 1.5 : speedY,
                    width: i === 0 ? 70 : 40,
                    height: i === 0 ? 90 : 40
                });
            }
            break;
        case 'pinPrank':
            minigameText.innerText = "Find a pin and place it on Ms. Martin's chair before she returns! Use arrow keys or D-pad to move.";
            goalX = 400;
            goalY = 100;
            
            // The goal is the teacher's chair
            goal.style.backgroundImage = "none";
            goal.style.backgroundColor = "#8B4513"; // Brown color for chair
            goal.style.borderRadius = "5px";
            goal.style.width = "80px";
            goal.style.height = "80px";
            
            // Create obstacles (other students watching)
            for (let i = 0; i < 5; i++) {
                const obstacle = document.createElement('div');
                obstacle.className = 'obstacle';
                obstacle.style.backgroundImage = 'none';
                obstacle.style.backgroundColor = '#ff9999';
                obstacle.style.width = '40px';
                obstacle.style.height = '40px';
                obstacle.style.borderRadius = '50%';
                obstaclesContainer.appendChild(obstacle);
                
                const obsX = 100 + Math.random() * 600;
                const obsY = 150 + Math.random() * 150;
                
                obstacles.push({
                    element: obstacle,
                    x: obsX,
                    y: obsY,
                    speedX: 0,
                    speedY: 0,
                    width: 40,
                    height: 40
                });
            }
            break;
    }
    
    // Position player and goal
    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;
    goal.style.left = `${goalX}px`;
    goal.style.top = `${goalY}px`;
    
    // Game loop
    const gameLoop = setInterval(() => {
        // Move obstacles
        obstacles.forEach(obs => {
            if (obs.speedX !== 0 || obs.speedY !== 0) {
                obs.x += obs.speedX;
                obs.y += obs.speedY;
                
                // Bounce off walls
                if (obs.x < 0 || obs.x > 740) {
                    obs.speedX *= -1;
                }
                if (obs.y < 0 || obs.y > 270) {
                    obs.speedY *= -1;
                }
                
                obs.element.style.left = `${obs.x}px`;
                obs.element.style.top = `${obs.y}px`;
            }
        });
        
        // Check collisions (but not for vent mazes)
        let collision = false;
        obstacles.forEach(obs => {
            // Skip collision detection for vent walls
            if (obs.isVentWall) return;
            
            const obsWidth = obs.width || 60;
            const obsHeight = obs.height || 80;
            
            if (
                playerX < obs.x + obsWidth &&
                playerX + 50 > obs.x &&
                playerY < obs.y + obsHeight &&
                playerY + 70 > obs.y
            ) {
                collision = true;
            }
        });
        
        if (collision) {
            clearInterval(gameLoop);
            minigameText.innerText = "You got caught! Game over!";
            
            setTimeout(() => {
                if (type === 'teachersLounge') {
                    changeScene('badEnding');
                } else if (type === 'findDora') {
                    changeScene('doraDateBadEnding');
                } else if (type === 'fireAlarm') {
                    changeScene('badEnding');
                } else if (type === 'principalOffice') {
                    changeScene('badEnding');
                } else if (type === 'specialEd') {
                    changeScene('badEnding');
                } else if (type === 'vendingMachine') {
                    changeScene('badEnding');
                } else if (type === 'pinPrank') {
                    changeScene('badEnding');
                } else {
                    // ... existing collision handling ...
                }
            }, 1500);
            return;
        }
        
        // Check if reached goal
        if (
            playerX < goalX + 60 &&
            playerX + 50 > goalX &&
            playerY < goalY + 80 &&
            playerY + 70 > goalY
        ) {
            clearInterval(gameLoop);
            minigameText.innerText = "You made it! Success!";
            
            setTimeout(() => {
                if (type === 'teachersLounge') {
                    changeScene('renameSchoolTablet');
                } else if (type === 'findDora') {
                    changeScene('askDoraOut');
                } else if (type === 'doraVent') {
                    changeScene('dateSuccess');
                } else if (type === 'fireAlarm') {
                    changeScene('pullFireAlarm');
                } else if (type === 'ventMaze') {
                    changeScene('ventEscape');
                } else if (type === 'principalOffice') {
                    changeScene('punchPrincipal');
                } else if (type === 'specialEd') {
                    changeScene('specialEdClassroom');
                } else if (type === 'vendingMachine') {
                    changeScene('breakVendingMachine');
                } else if (type === 'pinPrank') {
                    changeScene('placePin');
                } else {
                    // ... existing success handling ...
                }
            }, 1500);
        }
    }, 50);
    
    // Control player with arrow keys
    function handleKeyDown(e) {
        const speed = 5;
        
        switch(e.key) {
            case 'ArrowUp':
                playerY = Math.max(0, playerY - speed);
                break;
            case 'ArrowDown':
                playerY = Math.min(280, playerY + speed);
                break;
            case 'ArrowLeft':
                playerX = Math.max(0, playerX - speed);
                break;
            case 'ArrowRight':
                playerX = Math.min(750, playerX + speed);
                break;
        }
        
        player.style.left = `${playerX}px`;
        player.style.top = `${playerY}px`;
    }
    
    // Set up D-pad controls for mobile
    const setupDpadControls = () => {
        const speed = 5;
        
        // Up button
        document.querySelector('.dpad-up').addEventListener('touchstart', function(e) {
            e.preventDefault();
            playerY = Math.max(0, playerY - speed);
            player.style.top = `${playerY}px`;
        });
        
        // Down button
        document.querySelector('.dpad-down').addEventListener('touchstart', function(e) {
            e.preventDefault();
            playerY = Math.min(280, playerY + speed);
            player.style.top = `${playerY}px`;
        });
        
        // Left button
        document.querySelector('.dpad-left').addEventListener('touchstart', function(e) {
            e.preventDefault();
            playerX = Math.max(0, playerX - speed);
            player.style.left = `${playerX}px`;
        });
        
        // Right button
        document.querySelector('.dpad-right').addEventListener('touchstart', function(e) {
            e.preventDefault();
            playerX = Math.min(750, playerX + speed);
            player.style.left = `${playerX}px`;
        });
        
        // Also add click events for desktop testing
        document.querySelector('.dpad-up').addEventListener('click', function() {
            playerY = Math.max(0, playerY - speed);
            player.style.top = `${playerY}px`;
        });
        
        document.querySelector('.dpad-down').addEventListener('click', function() {
            playerY = Math.min(280, playerY + speed);
            player.style.top = `${playerY}px`;
        });
        
        document.querySelector('.dpad-left').addEventListener('click', function() {
            playerX = Math.max(0, playerX - speed);
            player.style.left = `${playerX}px`;
        });
        
        document.querySelector('.dpad-right').addEventListener('click', function() {
            playerX = Math.min(750, playerX + speed);
            player.style.left = `${playerX}px`;
        });
    };
    
    setupDpadControls();
    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up when minigame ends
    const cleanup = () => {
        window.removeEventListener('keydown', handleKeyDown);
        clearInterval(gameLoop);
        const dpad = document.getElementById('virtual-dpad');
        if (dpad) dpad.remove();
    };
    
    // Add cleanup to game state for proper removal
    gameState.minigameCleanup = cleanup;
}

function changeScene(sceneName) {
    if (!scenes[sceneName]) {
        console.error(`Scene ${sceneName} does not exist`);
        return;
    }
    
    // Call onExit function of current scene if it exists
    const currentScene = scenes[gameState.currentScene];
    if (currentScene && currentScene.onExit) {
        currentScene.onExit();
    }
    
    gameState.currentScene = sceneName;
    const scene = scenes[sceneName];
    
    // Update text
    document.getElementById('story-text').innerText = scene.text;
    
    // Update backgrounds
    if (scene.background) {
        document.getElementById('scene-image').style.backgroundImage = `url('${scene.background}')`;
    }
    
    // Update character
    if (scene.character) {
        document.getElementById('character').style.backgroundImage = `url('${scene.character}')`;
    }
    
    // Hide minigame container if it was active
    if (gameState.minigameActive) {
        document.getElementById('minigame-container').classList.add('hidden');
        gameState.minigameActive = false;
    }
    
    // Update choices
    const choicesContainer = document.getElementById('choices-container');
    choicesContainer.innerHTML = '';
    
    scene.choices.forEach(choice => {
        const button = document.createElement('button');
        button.id = choice.id;
        button.className = 'choice-btn';
        button.innerText = choice.text;
        button.addEventListener('click', () => {
            if (choice.action) {
                gameState.action = choice.action;
            }
            changeScene(choice.nextScene);
        });
        choicesContainer.appendChild(button);
    });
    
    // Run onLoad function if exists
    if (scene.onLoad) {
        scene.onLoad();
    }
}

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    changeScene('start');
    
    // Set up sound toggle
    const toggleSound = document.getElementById('toggle-sound');
    toggleSound.addEventListener('click', () => {
        gameState.soundEnabled = !gameState.soundEnabled;
        toggleSound.innerText = gameState.soundEnabled ? 'Sound: ON' : 'Sound: OFF';
    });
});