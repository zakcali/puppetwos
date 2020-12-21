# puppetwos
Web of Science (current link: https://apps.webofknowledge.com/WOS_AdvancedSearch_input.do?product=WOS&search_mode=AdvancedSearch ) advanced search by using puppeteer.
(New web site link: https://www.webofscience.com/wos/woscc/advanced-search ) can be accessed by my new program: https://github.com/zakcali/puppetwosnew

# Introduction
Web of Science is an indexing service for quality scientific publications worldwide. If you have an ip access, usually in an university campus area, you can search for publications and citations online at their web site: http://apps.webofknowledge.com/
"Basic Search" option can be redirected from html forms, described and accessed here: http://wokinfo.com/webtools/searchbox/

Unfortunately, there isn't any form (at least I couldn't find) for "Advanced Search" option. You must go to, http://apps.webofknowledge.com/ click "Advanced Search" option, enter search terms, and click Search button.
If you don't search regulary, and know what to do this procedure is okay. But if you want to search for a lot of authors, or search for a lot of departments in an university, this is waste of time.  
Those links decribe, what how to use advanced search: http://images.webofknowledge.com/WOKRS534DR1/help/WOS/hp_advanced_search.html
and http://images.webofknowledge.com/WOKRS534DR1/help/WOS/hp_advanced_examples.html

Program selects SCI-E, SSCI and AHCI indexes by default. This property was a challenge for me to accomplish by puppeteer.

# Proof 
Small script in the proof folder is a proof of concept. This is a nodejs script, opens a chrome web browser in your computer, opens Web of Science search page (assuming that you have access to site), clicks "Advanced Search" list-item, enters a text in search box, then clicks search button, waits for the results, and takes a screenshot. Uncomment the line //    await browser.close() if you want program to close the Chrome browser.

# Downloaded files:
You must change let csvurl= 'http://xxx.yyy.edu/zzz/department-list.csv' and let csvurl= 'http://xxx.yyy.edu/zzz/author-list.csv' url's according to your preference in renderer.js

# Electron build
Nodejs code, uses Electron, and can be packaged as a standalone program.
Loads "advanced search query texts" from (url) author-list.csv and (url) department-list.csv files, creates lists for departments and academicians. When selected, a Chrome browser window opened by puppeteer, and displays the results from Web of Science. You must have access rights to the Web of Science web site.  
