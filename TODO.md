# TODO - Features to add

1) Reboot should do a short fate linux boot sequence
2) Hitting return clears and goes to a new line now, but it goes out of view in the bottom. If you should return at the bottom, it should push terminal up to keep it in view.
3) the symlink projects (/var/www/projects) is a symlink to an executable... but when you go to /var/www/projects its a folder? And I can see /README.md n that dir but I can only cat when in that dir, if i CAT the whole dir, it doesnt work.
4) Backspace is not working somepletel
5) /usr/share/games/fortunes doesnt match the easter egg... its `fortune` not `fortunes`. Fix this, also itd be nice if you could actually execute this one directly too and still get the easter egg. Currently it just no command fortunes found or ./fortunes.... not sure if "local" command execution is working.
6. When executing a command like hacker, or something that requires terminal output, we dnot need the terminal entry (place you enter commands) until its done and we are back in the terminal.cd
7. Change prototype.ts to prototype.py (update README near it to call it out properl)
8. Instead of just making .project_x a hidden file inside of root... lets make a /root/projects, and call it some cool code name,
9. Actually imlement snake! you made it available via play, game or snake... just make it available through "snake".
10. Remove the "bright green highlight around the search box in blog's interactble window)-- only there when you are selected on it.

NEW TODO:
1. Command + C should basically stop what its doing create a new clean terminal line (basically what return does but without executing command on current line)
2. Why do we have "content" scattered everywhere, for example I searched for text in one of the blog posts and found it in FOUR!!! palces... one was actual yaml file with blog content (the CORRECT PLACE), which we are not using... -_-.... InteractiveBlog.ts, content-loader.ts and blog.ts.... whyyyyyy? Similar thing I found when looking for experience, its defined in experience.yaml, content-loader.tx and experience.ts? THE FUCK. I want the content-loader to LOAD the yaml files (WHICH SHOULD BE THE ONLY PLACE STUFF IS DEFINED), everything else needs to that content. FIX THIS, but BE VERY CLEAN ABOUT HOW YOU DO IT.

EASTER EGG STORY HUNT:
1. create another code-named project in /root/projects, with a README.md talking about finally making a breakthrough and creating a sentient AGI. Like project X's readme, it should read like a research journal entry.
2. We need to hide clues around, because I want to hide a program somewhere, deep into something that requires tracing clues around to get to it, that ultimately is the AI, that you can chat with. This needs to be cleverly constructed.

OTHRE BIG ONE:
1. Command to give a general run through this should be advertised for non-tech people to be able to use.

AFTER GOOD WITH TERMINAL
1. For non mobile, the terminal should be INSIDE of a retro poc displayed on the site possible.
