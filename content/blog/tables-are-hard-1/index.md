---
path: '/tables-are-hard-1' 
title: 'Tables are Hard, Part 1: History'
date: 2021-11-30T06:00:00.000+00:00
featured_image: tables-are-hard-1-hero.png
categories: ['Pixie Team Blogs']
authors: ['Nick Lanam']
emails: ['nlanam@pixielabs.ai']
---

It's just a grid of data, right?
Tables show up everywhere in software, and you probably don't think about them much.
Yet modern software packs a surprising amount of functionality into them, accumulated over the past half a century.

In this post, we'll take a high altitude pass over that history.
In later installments, we'll dive into how today's software handles the complex requirements of modern tables.

_This article is part of a series_:
- **Part 1: History**
- [Part 2: Building a Simple Data Table in React](/tables-are-hard-2)
- [Part 3: Streaming Data](/tables-are-hard-3)

## Modern Expectations

In a data-heavy web interface, a typical table might be expected to do all of this:

* **Fundamental:** Lay out complex data in a grid with consistent dimensions
* **Finding data:** Sort, filter, and search that data
* **Interactive data:** A cell may contain interactive components such as delete buttons, edit controls, etc.
* **Customized:** Users might resize columns, reorder them, or hide them selectively.
* **Accessible:** It's a web interface, after all. Mouse, keyboard, touch screens, screen readers, colorblind users, mobile and desktop dimensions, and more to accommodate.
* **Streaming:** When the backing data set is huge, it might not be delivered to the browser all at once. Sorting, filtering, searching, and scrolling all must coordinate with the server providing the data to behave as if the full set was there all along. This may even involve virtual scrolling to maintain the illusion, rather than pagination that users can see.
* **Performance:** Whether on an old smartphone or a massive display with a high refresh rate, the table needs to respond quickly. Nobody likes scroll jank.

Each of these features often belies its own pile of complexity. But how did we get this set of features?

## The First Spreadsheet Software

This journey begins in 1978 with the introduction of VisiCalc, the first spreadsheet software[^1].
Stackbit recently published a [fantastic introduction](https://www.stackbit.com/blog/story-of-visicalc/), but to summarize: it was the first software to combine mouse support and editing of individual cell formulae on personal computers.

This turned out to be a Pretty Big Deal&trade;.

I had the privilege of chatting with [Bob Frankston](https://frankston.com) this week, one of VisiCalc's creators.
He has contributed a great deal since the 1970's, but I wanted to focus on what existed before this project that might have inspired it.
Here's what he had to say (slightly edited for typos and links):

> Spreadsheets and accounting existed for hundreds of years.
> If you have someone used to working with screens (word processing) and back-of-the-envelope calculations for a class, you can see how it happens.
> Did you see [Dan's TEDx talk](https://www.ted.com/talks/dan_bricklin_meet_the_inventor_of_the_electronic_spreadsheet?language=en) about this?
>
> I did help program something we called "First Financial Language"[^2] at White-Weld in 1966.
> You gave it rows and columns, and it intersected the values.
> It was designed by [Butler Lampson](https://en.wikipedia.org/wiki/Butler_Lampson).
> The major departure for VisiCalc was the idea of editing individual cells and copying the formulas - basically getting rid of the fancy CS concepts.
>
> The key point is that personal computers were new and were toys so there weren't other implementations.
> Even when people copied [VisiCalc], they missed key design points.
> Why would a professional do a business app on a toy computer?

In short, we have Dan and Bob to thank for catalyzing the adoption of personal computers.

## Decades of Features

Spreadsheets have had decades to evolve since VisiCalc's first implementation.
Below is an oversimplified selection of some key developments in this space.

Year | Product | Significant Contributions
---: | :--- | :---
1979<br/>(official) | [VisiCalc](https://en.wikipedia.org/wiki/VisiCalc) | First spreadsheet software[^1] <br/>Mouse support<br/>Scrolling<br/>Formulas (similar to today's)<br/>Automatic formula propagation<br/>Ported many times over the years, including to Apple II
1980 | [SuperCalc](https://en.wikipedia.org/wiki/SuperCalc) | First VisiCalc competitor; ported to MS-DOS in 1982<br/>Solved bugs like circular refs that VisiCalc still had
1982 | [Microsoft Multiplan](https://en.wikipedia.org/wiki/Multiplan)<br/>(Excel's predecessor) | First to release on many systems, but not MS-DOS
1983 | [Lotus 1-2-3](https://en.wikipedia.org/wiki/Lotus_1-2-3) | Took advantage of IBM-PC hardware for much larger data<br/>Graphical charts<br/>Market dominant until Excel outstripped it in the 1990s
1985 | [Excel](https://en.wikipedia.org/wiki/Microsoft_Excel#Early_history) 1.0 | Largely similar to Lotus 1-2-3, without charts
1987 | Excel 2.0 | First spreadsheet that ran on Windows
1990 | Excel 3.0 | Toolbars, drawing, outlining, 3D charts...
[~1994](http://www.barrypearson.co.uk/articles/layout_tables/history.htm) | HTML `<table>` | The Mosaic browser existed since 1990, but tables weren't part of the HTML specification until 1994.
1996 | JavaScript | Some say it was the fourth horseman of the apocalypse.<br/>It does okay these days powering web apps though.<br/>Around this time, using `<table>` for layout became popular.
1999<br/>(spec) | [AJAX](https://en.wikipedia.org/wiki/Ajax_(programming)) | Allowed streaming data instead of reloading the page.<br/>Pagination eventually gave way for virtual scrolling, etc.
2006 | [Google Sheets](https://en.wikipedia.org/wiki/Google_Sheets) | Cloud save; collaborative editing; ran in browsers
Later | Bootstrap, flexbox, countless JS grid and table libraries | Mostly reinventing the wheel, but now it's _web scale_.

As you can see, modern tables support a variety of features. In the [next installment](/tables-are-hard-2), we'll dive into the technical end: how tables on the web handle these requirements.

[^1]: Dan Bricklin, one of VisiCalc's creators, has [written about this status](http://danbricklin.com/firstspreadsheetquestion.htm). It depends on how you split hairs.
[^2]: Bob talks about his time at White-Weld, among other things, in his 2017 piece [The Stories of Software](https://rmf.vc/ieeeaboutsoftware?pdf=t).

_Questions? Suggestions? Find us on [Slack](https://slackin.px.dev/), [GitHub](https://github.com/pixie-io/pixie/blob/main/CONTRIBUTING.md), or Twitter at [@pixie_run](https://twitter.com/pixie_run)._
