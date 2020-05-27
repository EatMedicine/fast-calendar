using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using fast_calendar_background.Models;

namespace fast_calendar_background.Controllers
{
    public class TipsController : ApiController
    {
        private FastCalendarEntities db = new FastCalendarEntities();

        // GET: api/Tips
        public IQueryable<Tip> GetTip()
        {
            return db.Tip;
        }

        // GET: api/Tips/5
        [ResponseType(typeof(Tip))]
        public IHttpActionResult GetTip(int id)
        {
            Tip tip = db.Tip.Find(id);
            if (tip == null)
            {
                return NotFound();
            }

            return Ok(tip);
        }

        // PUT: api/Tips/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutTip(int id, Tip tip)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != tip.id)
            {
                return BadRequest();
            }

            db.Entry(tip).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TipExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Tips
        [ResponseType(typeof(Tip))]
        public IHttpActionResult PostTip(Tip tip)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Tip.Add(tip);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tip.id }, tip);
        }

        // POST: api/Tips/list
        [ResponseType(typeof(List<Tip>))]
        [Route("api/Tips/list")]
        public IHttpActionResult list(List<Tip> tips)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var dbResult = db.Tip.AddRange(tips);
            db.SaveChanges();
            return Ok(dbResult);
        }

        // DELETE: api/Tips/5
        [ResponseType(typeof(Tip))]
        public IHttpActionResult DeleteTip(int id)
        {
            Tip tip = db.Tip.Find(id);
            if (tip == null)
            {
                return NotFound();
            }

            db.Tip.Remove(tip);
            db.SaveChanges();

            return Ok(tip);
        }

        

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TipExists(int id)
        {
            return db.Tip.Count(e => e.id == id) > 0;
        }
    }
}