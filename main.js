const fs = require("fs");
const Discord = require('discord.js');
var data = JSON.parse(fs.readFileSync("data.json"));
const login = JSON.parse(fs.readFileSync("login.json"));
const client = new Discord.Client();
var prefix = "!"
var discordChat;


function update(location, dat){
	if(typeof location === "undefined"){
		location = [];
	}
	location.splice(0,0,dat);
	fs.writeFile("data.json",JSON.stringify(data,null,"\t"));
}

client.login(login.secret);

client.on('ready', () => {
  console.log('[PESTERCHUM] BOT READY');
});

//putting a try/catch here so errors won't screw stuff up
try{
			
	client.on('message', msg => {

		var cmd;
		var arg = "";
		
		function print(content){
			msg.channel.sendMessage(content).catch(console.error);
		}

		function log(t){
			console.log(t)
			client.guilds.get("285229076631912448").channels.find("name", "general").sendMessage(t)
		}
		
		var mentions = msg.mentions.users.array();
		var args = [];
		
		var commands = {
			emojify: {
				name: "emojify",
				help: "Takes a message and turns the letters and most of the characters into emoji.\n	Usage:```"+prefix+"emojify [string]```",
				func: function(){
					var nums = ["zero","one","two","three","four","five","six","seven","eight","nine"];
					print(arg.replace(/[a-zA-Z]/g, ":regional_indicator_$&: ").replace(/[0-9]/g,function(x){
						return ":"+nums[x]+":";
					}));
				}
			},
			ping: {
				name: "ping",
				help:  "Says \"Pong!\"\n	Usage: ```"+prefix+"ping```",
				func: function(){
					print( "Pong!");
				}
			},
			stab: {
				name: "stab",
				help: "stab someone (or something) \n	Usage: ```"+prefix+"stab [something]```",
				func: function(){
					print( "You just stabbed" + arg + "!");
				}
			},
			help: {
				name: "help",
				help: "This command. \n Usage: ```"+prefix+"help```",
				func: function(){
					var text = "Commands: \n";
					
					for(var i in commands){
						text = text + "\n" + prefix + i + "\n" + commands[i].help
					}
					
					print(text);
				}
			},
			q: {
				name: "q",
				help: "Typing quirks done with regex. \n	Usage: ```"+prefix+"q [character name] [message]```",
				func: function(){
					if(data.quirks.hasOwnProperty(args[1].toLowerCase())){ 
						
						var out = arg.replace(" "+args[1],"");
						var quirk = data.quirks[args[1].toLowerCase()];
						
						for(var i in quirk){
							
							//If this particular element is a string, it's one of the special functions defined here.
							if(typeof quirk[i] === 'string'){
								
								switch(quirk[i]){
									case "upper":
										out = out.toUpperCase();
										break;
									case "lower":
										out = out.toLowerCase();
										break;
								}
								//If it's not a string, it's regex.
							}else{
						
								out = out.replace(new RegExp(quirk[i].str, "g"), quirk[i].rep);					
							}
						}
						
						if(msg.author.id == "160513341457039360" && args[1].toLowerCase() == "karkat"){
							out = "CG: " + out;
						}
						
						print(out);
						msg.delete()
					}
					else{
						print("The quirk for "+args[1]+" wasn't found! Are you sure it exists?");
					}
				}
			},
			flirt: {
				name: "flirt",
				help: "Randomly selects a flirts line for you. put \"nsfw\" in the message for dirty flirts. ;) \n"+
				"	usage: ```"+prefix+"flirt [nsfw]```",
				func: function(){
					if(arg.includes("nsfw")){
						if(msg.channel.name.startsWith("nsfw")){
							print(data.flirts.nsfw[Math.floor(Math.random() * data.flirts.nsfw.length)]);
						}
						else{
							print("NSFW flirts can only be used in a channel designated as such!")
						}
					}
					else{	
						print(data.flirts.safe[Math.floor(Math.random() * data.flirts.safe.length)]);
					}
				}
			},
			eval: {
				name: "eval",
				help: "Debug command. Evaluates a statement if you have permission.",
				func: function(){
					if(msg.author.id == "85561594766974976"){		
							eval(msg.content.replace('!eval ',''));
					}else{
						print("ur not viv sorry :c");
					}
				}
			}
		}
		
		if(msg.content.startsWith(prefix) && !msg.author.bot){
			
			for(var i in commands){
					
				var command = commands[i];
						
				if(msg.content.startsWith(prefix + command.name)){					
					arg = msg.content.replace(prefix+i,"");
					args = arg.split(" ");
					
					log("[PESTERCHUM] " + msg.author.username + " sent command " + command.name + "("+arg+") at " + msg.channel.name);
					
					command.func();
					break;
				}
			}
		}
	});

}catch(e){
		e.stackTraceLimit = 4;
		log("@everyone There was an error. stack trace below. \n\n"+e.stack);
}

