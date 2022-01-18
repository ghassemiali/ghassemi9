from django.shortcuts import render
from blog.models import Post, Tag
from website.models import Contact
from website.forms import NameForm, ContactForm, NewsletterForm
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib import messages


def home_view(request):
    return render(request, 'website/index.html')

def about_view(request):
    return render(request, 'website/about.html')

def contact_view(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            c = Contact()
            c.name = 'Anonymous'
            c.email = form.cleaned_data['email']
            c.subject = form.cleaned_data['subject']
            c.message = form.cleaned_data['message']
            c.save()
            messages.add_message(request, messages.SUCCESS, "your ticket submittet successfully")
        else:
            print('the data is not valid')
            messages.add_message(request, messages.ERROR, "your ticket didn't submitted")
    form = ContactForm()
    return render(request, 'website/contact.html', {'form': form})

def newsletter_view(request):
    if request.method == 'POST':
        form = NewsletterForm(request.POST)
        if form.is_valid():
            form.save()
        else:
            print('not valid')
    return HttpResponseRedirect('/')

def elements_view(request):
    return render(request, 'website/elements.html')

def test_view(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
        else:
            return HttpResponse('not valid')

    form = ContactForm()
    return render(request, 'test.html', {'form': form})